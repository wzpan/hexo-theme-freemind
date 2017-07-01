// github issue comment
// Copyright (C) 2017
// Joseph Pan <http://github.com/wzpan>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
// 
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
// 

// Get recent comment list from github issues
// TODO
'use strict';
var github_user, github_repo, no_comment, go_to_comment;
var spinOpts = {
    lines: 13,
    length: 10,
    width: 6,
    radius: 12,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#5882FA',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    className: 'spinner',
    zIndex: 2e9,
    top: 'auto',
    left: '50%'
};

var _getComment = function(params, callback) {
	let comments, comments_url, page;
	({comments, comments_url, page} = params);
    // Get comments
    $.ajax({
        url: comments_url + '?page=' + page,
        dataType: 'json',
		cache: false,
        success: function (page_comments) {
            if (!page_comments || page_comments.length <= 0) {
				(callback && typeof(callback) === "function") && callback(comments);
				return;
            }
			page_comments.forEach(function(comment){
                comments.push(comment);
			}) ;
            page += 1;
			params.comments = comments;
			params.page = page;
            _getComment(params, callback);
        },
		error: function(err) {
			(callback && typeof(callback) === "function") && callback(comments);
			return;
		}
    });
}

var _getCommentsUrl = function(params, callback) {
	let page_title, page;
	let found = false;
	({page_title, page} = params);
    $.ajax({
        url: 'https://api.github.com/repos/' + github_user + '/' + github_repo + '/issues?page=' + page,
        dataType: 'json',
		cache: false,
		success: function (issues) {
            if (!issues || issues.length <= 0) {
				(callback && typeof(callback) === "function") && callback("", "");
				return;
            }
			issues.forEach(function(issue){
				// match title
                if (issue.title && issue.title == page_title) {
                    (callback && typeof(callback) === "function") && callback(issue.comments_url, issue);
					found = true;
					return;
                }
			});
			if (!found) {
				page += 1;
				params.page = page;
				_getCommentsUrl(params, callback);
			}
			return;
        },
        error: function() {
			(callback && typeof(callback) === "function") && callback("", "");
			return;
        }
    });
}

var _getIssue = function(issue_id, callback) {
	let issue_url = 'https://api.github.com/repos/' + github_user + '/' + github_repo + '/issues/' + issue_id;
	_getIssueByUrl(issue_url, (issue)=>{
		(callback && typeof(callback) === "function") && callback(issue);
	});
}

var _getIssueByUrl = function(issue_url, callback) {
	$.ajax({
        url: issue_url,
        dataType: 'json',
		cache: false,
        success: function (issues) {
            if (!issues || issues.length <= 0) {
				(callback && typeof(callback) === "function") && callback();
				return;
            }
			let issue = issues;
			(callback && typeof(callback) === "function") && callback(issue);
			return;
        },
        error: function() {
			(callback && typeof(callback) === "function") && callback();
			return;
        }
    });
}

var _renderComment = function(comment) {
	var timeagoInstance = timeago();
	let user = comment.user;
    let content = markdown.toHTML(comment.body);
    let ago = timeagoInstance.format(comment.created_at);
	let current_user = user.login == github_user ? "current-user" : "";
	let owner = user.login == github_user ? `
		<span class="timeline-comment-label text-bold tooltipped tooltipped-multiline tooltipped-s" aria-label="${user} is the author of this blog.">
		Owner
	</span>
		` : '';
	return `
		<div class="timeline-comment-wrapper js-comment-container">
		<div class="avatar-parent-child timeline-comment-avatar">
		<a href="http://github.com/${user.login}">
		<img alt="@${user.login}" class="avatar rounded-1" height="44" src="${user.avatar_url}&amp;s=88" width="44">
		</a>
		</div>
		<div id="issuecomment-310820108" class="comment previewable-edit js-comment js-task-list-container  timeline-comment js-reorderable-task-lists reorderable-task-lists ${current_user}" data-body-version="0ff4a390ed2be378bf5044aa6dc1510b">

		<div class="timeline-comment-header">
		${owner}
		<h3 class="timeline-comment-header-text f5 text-normal">

		<strong>
		<a href="http://github.com/${user.login}" class="author">${user.login}</a>
		
	</strong>

	commented  

		<a href="#issuecomment-${comment.id}" class="timestamp"><relative-time datetime="${comment.created_at}" title="${comment.created_at}">${ago}</relative-time></a>

	</h3>
		</div>
		
		<table class="d-block">
		<tbody class="d-block">
		<tr class="d-block">
		<td class="d-block comment-body markdown-body  js-comment-body">
		<p>${content}</p>
		</td>
		</tr>
		</tbody>
		</table>
		</div>
		</div>
		`
}

var _renderRecentComment = function(user, title, content, time, url) {
	let res = `
	    <div class="comment-item">
		<div class="row">
		  <div class="span3 comment-widget-avatar">
		    <a href="http://github.com/${user.login}">
		      <img alt="@${user.login}" class="avatar rounded-1" height="44" src="${user.avatar_url}&amp;s=88" width="44">
		    </a>
		</div>
		<div class="comment-widget-main">
		<span><a class="comment-widget-user" href="http://github.com/${user.login}" target="_blank">${user.login}</a> </span>
		  <div class="comment-widget-content">${content}</div>
		</div>
		</div>
		<div class="row comment-widget-meta">
		  <span class="comment-widget-title">${title}</span> | <span class="comment-widget-date">${time}</span>
		</div>
		</div>
	`
	$(".recent-comments").append(res);
}

var _renderRecentCommentList = function(comments, count) {
	var timeagoInstance = timeago();
	let render_count = 0;
	for (let i=0; render_count<count && i<comments.length; ++i) {
		let comment = comments[i];
		let content = markdown.toHTML(comment.body);
		let title = comment.title;
		let user = comment.user;
		let time = timeagoInstance.format(comment.created_at);
		let url = comment.html_url;
		if (!content || content == '') continue;
		if (!title) {
			// Get title of issue
			_getIssueByUrl(comment.issue_url, (issue)=>{
				_renderRecentComment(user, issue.title, content, time, url);
			})
		} else {
			_renderRecentComment(user, title, content, time, url);
		}	
		render_count++;
	}
}

var _renderHTML = function(params) {
	let issue, comments, comments_url, page_title;
	({issue, comments, comments_url, page_title} = params);
	//let res = `<span class="comment-count">${comments.length} Comments</span>`;
	let res = '';
	if ((!issue || !issue.body || issue.body == "") && (!comments || comments.length <= 0)) {
		res += `
			<div class='js-discussion no-comment'>
			<span>${no_comment}</span>
			</div>
			`
	} else {
		res += `
            <div class="discussion-timeline js-quote-selection-container">
            <div class="js-discussion js-socket-channel">
            `
		if (issue && issue.body && issue.body != '') {
			res += _renderComment(issue);
		}		
		comments.forEach(function(comment) {
			res += _renderComment(comment);
		});
        res += '</div></div>'
	}
	let issue_url;
	if (!comments_url) {
		issue_url = `http://github.com/${github_user}/${github_repo}/issues/new?title=${page_title}#issue_body`;		
	} else {
		issue_url = comments_url.replace('api.github.com/repos', 'github.com').replace('comments', '') + '#new_comment_field';
	}
	res += `
		<p class="goto-comment pull-right">
		<a href="${issue_url}" class="btn btn-large btn-primary" target="_blank">${go_to_comment} &rarr;</a>
		</p>
	`
	var commentDIV = document.getElementById('github-comment');
	commentDIV.innerHTML = res;
}

var _getRecentIssues = function(params, callback) {
	let count;
	({github_user, github_repo, count} = params)
	$.ajax({
        url: 'https://api.github.com/repos/' + github_user + '/' + github_repo + '/issues\?per_page\=100',
        dataType: 'json',
		cache: false,
        success: function (issues) {
			if (issues.length > count) {
				issues = issues.sort('created_at').reverse().slice(0, 5);
			}
			(callback && typeof(callback) === "function") && callback(issues);
			return;
        },
		error: function (err) {
			(callback && typeof(callback) === "function") && callback();
			return;
		}
    });
}

var _getRecentComments = function(params, callback) {
	let count;
	({github_user, github_repo, count} = params)
	$.ajax({
        url: 'https://api.github.com/repos/' + github_user + '/' + github_repo + '/issues/comments\?per_page\=100',
        dataType: 'json',
		cache: false,
        success: function (comments) {
			if (comments.length > count) {
				comments = comments.sort('created_at').reverse().slice(0, 5);
				console.log(comments);
			}
			
            (callback && typeof(callback) === "function") && callback(comments);
			return;
        },
		error: function (err) {
			(callback && typeof(callback) === "function") && callback();
			return;
		}
    });
}

var CompareDate = function(a, b) {
	let d1 = a['created_at'].replace('T', ' ').replace('Z', '').replace(/-/g,"\/");
	let d2 = b['created_at'].replace('T', ' ').replace('Z', '').replace(/-/g,"\/");
	return ((new Date(d1)) > (new Date(d2)));
}

var getRecentCommentsList = function(params, callback) {
	let count;	
	({github_user, github_repo, count} = params)
	var recentList = new Array();
	// Get recent issues and comments and filter out 10 newest comments
    _getRecentIssues(params, (issues)=>{
		recentList = recentList.concat(issues);
		_getRecentComments(params, (comments)=>{
			recentList = recentList.concat(comments);
			recentList = recentList.sort(CompareDate).reverse();
			_renderRecentCommentList(recentList, count);
		});
	});
}

var getComments = function(params, callback) {
    let page_title, issue_id;
	({github_user, github_repo, no_comment, go_to_comment, page_title, issue_id} = params)
	var timeagoInstance = timeago();
    var comments_url;
	var comments = new Array();
    var spinner = new Spinner(spinOpts);
	var target = document.getElementById("loading-comment");
	spinner.spin(target);
    if (!issue_id || issue_id == 'undefined' || typeof(issue_id) == 'undefined') {
        _getCommentsUrl({page_title: page_title,
						 page: 1}, (comments_url, issue) => {
							 if (comments_url != '' && comments_url != undefined) {
								 _getComment({comments: comments,
											  comments_url: comments_url,
											  page: 1}
											 , (comments) => {
												 spinner.spin();
												 _renderHTML({
													 issue: issue,
													 comments: comments,
													 comments_url: comments_url,
													 page_title: page_title
												 }); 
												 (callback && typeof(callback) === "function") && callback(comments);
												 return;
											 });
							 } else {
								 spinner.spin();
								 _renderHTML({
									 issue: issue,
									 comments: comments,
									 comments_url: comments_url,
									 page_title: page_title
								 });
								 (callback && typeof(callback) === "function") && callback(comments);
								 return;
							 }
						 });
    } else {
        let comments_url = 'https://api.github.com/repos/' + github_user + '/' + github_repo + '/issues/' + issue_id + '/comments';
		_getIssue(issue_id, (issue) => {
			_getComment({comments: comments,
						 comments_url: comments_url,
						 page: 1}
						, (comments) => {
							spinner.spin();
							_renderHTML({
								issue: issue,
								comments: comments,
								comments_url: comments_url,
								page_title: page_title
							});
							spinner.spin();
							(callback && typeof(callback) === "function") && callback(comments);
							return;
						});
		})
    }
}


