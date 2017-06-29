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
var getRecentCommentList = function(github_repo, count) {
    'use strict';
    $.ajax({
        url: 'https://api.github.com/repos/' + github_repo + '/issues/comments\?per_page\=count',
        dataType: 'json',
        success: function (response) {
            console.log(response);
        }
    });
}

var _getComment = function(comments, comments_url, page, callback) {
    // Get comments
    $.ajax({
        url: comments_url + '?page=' + page,
        dataType: 'json',
        success: function (page_comments) {
            if (!page_comments || page_comments.length <= 0) {
				(callback && typeof(callback) === "function") && callback(comments);
				return;
            }
			page_comments.forEach(function(comment){
                comments.push(comment);
			}) ;
            page += 1;
            _getComment(comments, comments_url, page, callback);
        },
		error: function(err) {
			(callback && typeof(callback) === "function") && callback(comments);
			return;
		}
    });
}

var _getCommentsUrl = function(github_repo, page_title, page, callback) {
    $.ajax({
        url: 'https://api.github.com/repos/' + github_repo + '/issues?page=' + page,
        dataType: 'json',
        success: function (issues) {
            if (!issues || issues.length <= 0) {
				(callback && typeof(callback) === "function") && callback('');
				return;
            }
			issues.forEach(function(issue){
				// match title
                if (issue.title && issue.title == page_title) {
                    comments_url = issue.comments_url;
                    (callback && typeof(callback) === "function") && callback(comments_url);
					return;
                }
			});
            page += 1;
            _getCommentsUrl(github_repo, page_title, page, callback);
			return;
        },
        error: function() {
			(callback && typeof(callback) === "function") && callback(comments_url);
			return;
        }
    });
}

var _renderHTML = function(comments, comments_url) {
	//let res = `<span class="comment-count">${comments.length} Comments</span>`;
	let res = '';
	if (!comments || comments.length <= 0) {
		res += `
<div class='js-discussion no-comment'>
<span>暂时还没有评论呢，快来抢沙发吧！</span>
</div>
`
	} else {
		res += '<div class="js-discussion js-socket-channel">'
		comments.forEach(function(comment) {
			let user = comment.user;
			res += `
						<div class="timeline-comment-wrapper js-comment-container">
						<div class="avatar-parent-child timeline-comment-avatar">
						<a href="http://github.com/${user.login}">
						<img alt="@${user.login}" class="avatar rounded-1" height="44" src="${user.avatar_url}&amp;s=88" width="44">
						</a>

					</div>
						<div id="issuecomment-310820108" class="comment previewable-edit js-comment js-task-list-container  timeline-comment js-reorderable-task-lists reorderable-task-lists current-user" data-body-version="0ff4a390ed2be378bf5044aa6dc1510b">

						<div class="timeline-comment-header">
						<span class="timeline-comment-label text-bold tooltipped tooltipped-multiline tooltipped-s" aria-label="You are the owner of the hexo-theme-freemind-blog repository.">
						Owner
					</span>
						<h3 class="timeline-comment-header-text f5 text-normal">

						<strong>
				<a href="http://github.com/${user.login}" class="author">${user.login}</a>
						
					</strong>

					commented

						<a href="#issuecomment-${comment.id}" class="timestamp"><relative-time datetime="${comment.created_at}" title="${comment.created_at}">at ${comment.created_at}</relative-time></a>

					</h3>
						</div>
						
						<div class="edit-comment-hide">
						<table class="d-block">
						<tbody class="d-block">
						<tr class="d-block">
						<td class="d-block comment-body markdown-body  js-comment-body">
						<p>${comment.body}</p>
						</td>
						</tr>
						</tbody>
						</table>
						</div>
						</div>
						</div>
						`
					res += '</div>'
		});
	}
	issue_url = comments_url.replace('api.github.com/repos', 'github.com').replace('comments', '');
	res += `
		<p class="pull-right">
		<a href="${issue_url}" class="btn btn-large btn-primary" target="_blank">Comment &rarr;</a>
		</p>
		`
	var commentDIV = document.getElementById('githubComment');
	commentDIV.innerHTML = res;
	
}

var getComments = function(github_repo, page_title, issue_id, callback) {
    'use strict';
    var comments_url;
	var comments = new Array();
    if (!issue_id || issue_id == 'undefined' || typeof(issue_id) == 'undefined') {
        _getCommentsUrl(github_repo, page_title, 1, (comments_url) => {
			if (comments_url != '' && comments_url != undefined) {
				_getComment(comments, comments_url, 1, (comments) => {
					console.log(comments);
					_renderHTML(comments, comments_url);
					(callback && typeof(callback) === "function") && callback(comments);
					return;
				});
			} else {
				_renderHTML(comments, comments_url);
				(callback && typeof(callback) === "function") && callback(comments);
				return;
			}
		});
    } else {
        comments_url = 'https://api.github.com/repos/' + github_repo + '/issues/' + issue_id + '/comments';
		_getComment(comments, comments_url, 1, (comments) => {
			renderHTML(comments, comments_url);
			(callback && typeof(callback) === "function") && callback(comments);
			return;
		});
    }
}


