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
        success: function (comments) {
            if (!comments || comments.length <= 0) {
				(callback && typeof(callback) === "function") && callback(comments);
				return;
            }
            for (let j=0; j<comments.length; ++j) {
                let comment = comments[j];
                comments.push(comment);
				let body = comment['body'];
                let created_at = comment['created_at'];
                let user = comment['user'];
				console.log(comment);
                console.log(body);
                console.log(created_at);
                console.log(user);
				(callback && typeof(callback) === "function") && callback(comments);
				return;
            }
            page += 1;
            _getComment(comments, comments_url, page, callback);
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
            for (let i=0; i<issues.length; ++i) {
                let issue = issues[i];
                // match title
                if (issue['title'] && issue['title'] == page_title) {
                    comments_url = issue['comments_url'];
                    (callback && typeof(callback) === "function") && callback(comments_url);
					return;
                }
            }
            page += 1;
            _getCommentsUrl(github_repo, page_title, page, callback);
			return;
        },
        error: function() {
			(callback && typeof(callback) === "function") && callback('comments_url');
			return;
        }
    });

}

var getComment = function(github_repo, page_title, issue_id) {
    'use strict';
    var comments_url;
	var comments = new Array();
    if (!issue_id || issue_id == 'undefined' || typeof(issue_id) == 'undefined') {
        _getCommentsUrl(github_repo, page_title, 1, (comments_url) => {
			if (comments_url != '' && comments_url != undefined) {
				_getComment(comments, comments_url, 1, (comments) => {
					return comments;
				});
			}
		});
    } else {
        comments_url = 'https://api.github.com/repos/' + github_repo + '/issues/' + issue_id + '/comments';
		_getComment(comments, comments_url, 1, (comments) => {
			return comments;
		});
    }
}
