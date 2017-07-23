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

'use strict';

var type, username, repo, client_id, client_secret, no_comment, go_to_comment, btn_class, comments_target, recent_comments_target, loading_target;
var github_addr = "https://github.com/";
var github_api_addr = "https://api.github.com/repos/";
var oschina_addr = "http://git.oschina.net/";
var oschina_api_addr = "http://git.oschina.net/api/v5/repos/";
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

var _getComment = function _getComment(params, callback) {
    var comments = void 0,
        comments_url = void 0,
        page = void 0;

    // Get comments
    comments = params.comments;
    comments_url = params.comments_url;
    page = params.page;
    $.ajax({
        url: comments_url + '?page=' + page,
        dataType: 'json',
        cache: false,
        crossDomain: true,
        data: client_id && client_secret ? "client_id=" + client_id + "&client_secret=" + client_secret : '',
        success: function success(page_comments) {
            if (!page_comments || page_comments.length <= 0) {
                callback && typeof callback === "function" && callback(comments);
                callback = null;
                return;
            }
            page_comments.forEach(function (comment) {
                comments.push(comment);
            });
            page += 1;
            params.comments = comments;
            params.page = page;
            _getComment(params, callback);
        },
        error: function error(err) {
            callback && typeof callback === "function" && callback(comments);
            callback = null;
        }
    });
};

var _getCommentsUrl = function _getCommentsUrl(params, callback) {
    var issue_title = void 0,
        page = void 0;
    var found = false;
    issue_title = params.issue_title;
    page = params.page;

    var api_addr = type == 'github' ? github_api_addr : oschina_api_addr;
    $.ajax({
        url: api_addr + username + '/' + repo + '/issues?page=' + page,
        dataType: 'json',
        cache: false,
        crossDomain: true,
        data: client_id && client_secret ? "client_id=" + client_id + "&client_secret=" + client_secret : '',
        success: function success(issues) {
            if (!issues || issues.length <= 0) {
                callback && typeof callback === "function" && callback("", "");
                callback = null;
                return;
            }
            issues.forEach(function (issue) {
                // match title
                if (issue.title && issue.title == issue_title) {
                    callback && typeof callback === "function" && callback(issue.comments_url, issue);
                    found = true;
                    callback = null;
                }
            });
            if (!found) {
                page += 1;
                params.page = page;
                _getCommentsUrl(params, callback);
            }
            return;
        },
        error: function error() {
            callback && typeof callback === "function" && callback("", "");
            callback = null;
        }
    });
};

var _getIssue = function _getIssue(issue_id, callback) {
    var api_addr = type == 'github' ? github_api_addr : oschina_api_addr;
    var issue_url = api_addr + username + '/' + repo + '/issues/' + issue_id;
    _getIssueByUrl(issue_url, function (issue) {
        callback && typeof callback === "function" && callback(issue);
        callback = null;
    });
};

var _getIssueByUrl = function _getIssueByUrl(issue_url, callback) {
    $.ajax({
        url: issue_url,
        dataType: 'json',
        cache: false,
        crossDomain: true,
        data: client_id && client_secret ? "client_id=" + client_id + "&client_secret=" + client_secret : '',
        success: function success(issues) {
            if (!issues || issues.length <= 0) {
                callback && typeof callback === "function" && callback();
                callback = null;
                return;
            }
            var issue = issues;
            callback && typeof callback === "function" && callback(issue);
            callback = null;
        },
        error: function error() {
            callback && typeof callback === "function" && callback();
            callback = null;
        }
    });
};

var _renderComment = function _renderComment(comment) {
    var timeagoInstance = timeago();
    var user = comment.user;
    var content = marked(comment.body);
    var ago = timeagoInstance.format(comment.created_at);
    var current_user = user.login == username ? "current-user" : "";
    var addr = type == 'github' ? github_addr : oschina_addr;
    var owner = user.login == username ? "\n        <span class=\"timeline-comment-label text-bold tooltipped tooltipped-multiline tooltipped-s\" aria-label=\"" + username + " is the author of this blog.\">\n        Owner\n    </span>\n        " : '';
    return "\n        <div class=\"timeline-comment-wrapper js-comment-container\">\n        <div class=\"avatar-parent-child timeline-comment-avatar\">\n        <a href=\"" + addr + user.login + "\">\n        <img alt=\"@" + user.login + "\" class=\"avatar rounded-1\" height=\"44\" src=\"" + user.avatar_url + "&amp;s=88\" width=\"44\">\n        </a>\n        </div>\n        <div id=\"issuecomment-310820108\" class=\"comment previewable-edit js-comment js-task-list-container  timeline-comment js-reorderable-task-lists reorderable-task-lists " + current_user + "\" data-body-version=\"0ff4a390ed2be378bf5044aa6dc1510b\">\n\n        <div class=\"timeline-comment-header\">\n        " + owner + "\n        <h3 class=\"timeline-comment-header-text f5 text-normal\">\n\n        <strong>\n        <a href=\"" + addr + user.login + "\" class=\"author\">" + user.login + "</a>\n        \n    </strong>\n\n    commented  \n\n        <a href=\"#issuecomment-" + comment.id + "\" class=\"timestamp\"><relative-time datetime=\"" + comment.created_at + "\" title=\"" + comment.created_at + "\">" + ago + "</relative-time></a>\n\n    </h3>\n        </div>\n        \n        <table class=\"d-block\">\n        <tbody class=\"d-block\">\n        <tr class=\"d-block\">\n        <td class=\"d-block comment-body markdown-body js-comment-body\">\n        " + content + "\n    </td>\n        </tr>\n        </tbody>\n        </table>\n        </div>\n        </div>\n        ";
};

var _renderRecentComment = function _renderRecentComment(user, title, content, time, url, callback) {
    var addr = type == 'github' ? github_addr : oschina_addr;
    var res = "\n        <div class=\"comment-item\">\n          <div class=\"row comment-widget-head\">\n            <div class=\"xl-col-3 comment-widget-avatar\">\n              <a href=\"" + addr + user.login + "\">\n                <img alt=\"@" + user.login + "\" class=\"avatar rounded-1\" height=\"44\" src=\"" + user.avatar_url + "&amp;s=88\" width=\"44\">\n              </a>\n            </div>\n            <div class=\"comment-widget-body\">\n              <span><a class=\"comment-widget-user\" href=\"" + addr + user.login + "\" target=\"_blank\">" + user.login + "</a> </span>\n              <div class=\"comment-widget-content\">" + content + "</div>\n            </div>\n          </div>\n          <br/>\n          <div class=\"comment-widget-meta\">\n            <span class=\"comment-widget-title\">" + title + "</span> | <span class=\"comment-widget-date\">" + time + "</span>\n          </div>\n        </div>\n        ";
    callback && typeof callback === "function" && callback(res);
    callback = null;
};

var _getRecentCommentList = function _getRecentCommentList(comment_list, i, render_count, total_count, comments, callback) {
    if (render_count >= total_count || i >= comments.length) {
        callback && typeof callback === "function" && callback(comment_list);
        callback = null;
        return;
    }
    var comment = comments[i];
    if (!comment) return;
    var content = marked(comment.body);
    var title = comment.title;
    var user = comment.user;
    var timeagoInstance = timeago();
    var time = timeagoInstance.format(comment.created_at);
    var url = comment.html_url;
    if (!content || content == '') {
        i++;
        _getRecentCommentList(comment_list, i, render_count, total_count, comments, callback);
        callback = null;
        return;
    }
    if (!title) {
        // Get title of issue
        _getIssueByUrl(comment.issue_url, function (issue) {
            _renderRecentComment(user, issue.title, content, time, url, function (item) {
                comment_list += item;
                i++;
                render_count++;
                _getRecentCommentList(comment_list, i, render_count, total_count, comments, callback);
            });
        });
    } else {
        _renderRecentComment(user, title, content, time, url, function (item) {
            comment_list += item;
            i++;
            render_count++;
            _getRecentCommentList(comment_list, i, render_count, total_count, comments, callback);
        });
    }
};

var _renderRecentCommentList = function _renderRecentCommentList(comments, count) {
    var i = 0;
    var render_count = 0;
    var comment_list = '';
    _getRecentCommentList(comment_list, i, render_count, count, comments, function (comment_list) {
        $(recent_comments_target).append(comment_list);
    });
};

var _renderHTML = function _renderHTML(params) {
    var type = void 0,
        issue = void 0,
        comments = void 0,
        comments_url = void 0,
        issue_title = void 0;
    type = params.type;
    issue = params.issue;
    comments = params.comments;
    comments_url = params.comments_url;
    issue_title = params.issue_title;
    var site = type == 'oschina' ? '<a href="http://oschina.net" class="discussion-item-entity" target="_blank">OSChina issue</a>' : '<a href="http://github.com" class="discussion-item-entity" target="_blank">Github issue</a>';
    var footer = `
<div class="discussion-item discussion-item-labeled">
    <h3 class="discussion-item-header f5 text-normal" id="event-1157063333">

      <span class="discussion-item-icon">
        <svg aria-hidden="true" class="octicon octicon-tag" height="16" version="1.1" viewBox="0 0 16 16" width="14"><path fill-rule="evenodd" d="M15 1H6c-.55 0-1 .45-1 1v2H1c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h1v3l3-3h4c.55 0 1-.45 1-1V9h1l3 3V9h1c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1zM9 11H4.5L3 12.5V11H1V5h4v3c0 .55.45 1 1 1h3v2zm6-3h-2v1.5L11.5 8H6V2h9v6z"></path></svg>
      </span>
      The above comments are provided by 
        <a href="http://github.com/wzpan/comment.js" class="discussion-item-entity" target="_blank">comment.js</a> with the help of ${site}.
    </h3>
</div>
    `;
    var addr = type == 'github' ? github_addr : oschina_addr;
    var api_addr = type == 'github' ? github_api_addr : oschina_api_addr;
    if ((!issue || !issue.body || issue.body == "") && (!comments || comments.length <= 0)) {
        var _res = "\n            <div class='js-discussion no-comment'>\n            <span>" + no_comment + "</span>\n            </div>\n            ";
        $(comments_target).append(_res);
    } else {
        var _res2 = "\n            <div class=\"discussion-timeline js-quote-selection-container\">\n            <div class=\"js-discussion js-socket-channel\">\n            ";
        if (issue && issue.body && issue.body != '') {
            _res2 += _renderComment(issue);
        }
        comments.forEach(function (comment) {
            _res2 += _renderComment(comment);
        });
        _res2 += footer;
        _res2 += '</div></div>';        
        $(comments_target).append(_res2);
    }
    var issue_url = void 0;
    if (!comments_url) {
        issue_url = addr + "/" + username + "/" + repo + "/issues/new?title=" + issue_title + "#issue_body";
    } else {
        issue_url = comments_url.replace(api_addr, addr).replace('comments', '') + '#new_comment_field';
    }
    var res = "\n        <p class=\"goto-comment\">\n        <a href=\"" + issue_url + "\" class=\"" + btn_class + "\" target=\"_blank\">" + go_to_comment + "</a>\n        </p>\n        ";
    $(comments_target).append(res);
};

var CompareDate = function CompareDate(a, b) {
    var d1 = a['created_at'].replace('T', ' ').replace('Z', '').replace(/-/g, "\/");
    var d2 = b['created_at'].replace('T', ' ').replace('Z', '').replace(/-/g, "\/");
    return new Date(d1) > new Date(d2);
};

var _getRecentIssues = function _getRecentIssues(params, callback) {
    var count = void 0;
    count = params.count;

    var api_addr = type == 'github' ? github_api_addr : oschina_api_addr;
    $.ajax({
        url: api_addr + username + '/' + repo + '/issues?per_page=100&sort=created&direction=desc',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        data: client_id && client_secret ? "client_id=" + client_id + "&client_secret=" + client_secret : '',
        success: function success(issues) {
            if (issues.length > count) {
                if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1 || !!document.documentMode == true) {
                    issues = issues.sort(CompareDate).slice(0, 5);
                } else {
                    issues = issues.sort(CompareDate).reverse().slice(0, 5);
                }
            }
            callback && typeof callback === "function" && callback(issues);
            callback = null;
        },
        error: function error(err) {
            callback && typeof callback === "function" && callback();
            callback = null;
        }
    });
};

var _getRecentComments = function _getRecentComments(params, callback) {
    var count = void 0;
    count = params.count;

    var api_addr = type == 'github' ? github_api_addr : oschina_api_addr;
    $.ajax({
        url: api_addr + username + '/' + repo + '/issues/comments?per_page=100&sort=created&direction=desc',
        dataType: 'json',
        cache: false,
        crossDomain: true,
        data: client_id && client_secret ? "client_id=" + client_id + "&client_secret=" + client_secret : '',
        success: function success(comments) {
            if (comments.length > count) {
                if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1 || !!document.documentMode == true) {
                    comments = comments.sort(CompareDate).slice(0, 5);
                } else {
                    comments = comments.sort(CompareDate).reverse().slice(0, 5);
                }
            }

            callback && typeof callback === "function" && callback(comments);
            callback = null;
        },
        error: function error(err) {
            callback && typeof callback === "function" && callback();
            callback = null;
        }
    });
};

var getRecentCommentsList = function getRecentCommentsList(params) {
    var count = void 0,
        user = void 0;
    type = params.type;
    user = params.user;
    repo = params.repo;
    client_id = params.client_id;
    client_secret = params.client_secret;
    count = params.count;
    recent_comments_target = params.recent_comments_target;

    username = user;
    recent_comments_target = recent_comments_target ? recent_comments_target : '#recent-comments';
    var recentList = new Array();
    // Get recent issues and comments and filter out 10 newest comments
    _getRecentIssues(params, function (issues) {
        recentList = recentList.concat(issues);
        _getRecentComments(params, function (comments) {
            recentList = recentList.concat(comments);
            if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1 || !!document.documentMode == true) {
                recentList = recentList.sort(CompareDate);
            } else {
                recentList = recentList.sort(CompareDate).reverse();
            }
            _renderRecentCommentList(recentList, count);
        });
    });
};

var getComments = function getComments(params) {
    var issue_title = void 0,
        issue_id = void 0,
        user = void 0;
    type = params.type;
    user = params.user;
    repo = params.repo;
    client_id = params.client_id;
    client_secret = params.client_secret;
    no_comment = params.no_comment;
    go_to_comment = params.go_to_comment;
    issue_title = params.issue_title;
    issue_id = params.issue_id;
    btn_class = params.btn_class;
    comments_target = params.comments_target;
    loading_target = params.loading_target;

    comments_target = comments_target ? comments_target : '#comment-thread';
    username = user;
    var spinner = new Spinner(spinOpts);
    var timeagoInstance = timeago();
    var comments_url;
    var comments = new Array();
    type = type ? type : 'github';
    btn_class = btn_class ? btn_class : 'btn';

    loading_target && spinner.spin($("div" + loading_target).get(0));
    if (!issue_id || issue_id == 'undefined' || typeof issue_id == 'undefined') {
        _getCommentsUrl({ issue_title: issue_title,
            page: 1 }, function (comments_url, issue) {
            if (comments_url != '' && comments_url != undefined) {
                _getComment({ comments: comments,
                    comments_url: comments_url,
                    page: 1 }, function (comments) {
                    loading_target && spinner.spin();
                    _renderHTML({
                        type: type,
                        issue: issue,
                        comments: comments,
                        comments_url: comments_url,
                        issue_title: issue_title
                    });
                    return;
                });
            } else {
                loading_target && spinner.spin();
                _renderHTML({
                    type: type,
                    issue: issue,
                    comments: comments,
                    comments_url: comments_url,
                    issue_title: issue_title
                });
                return;
            }
        });
    } else {
        var api_addr = type == 'github' ? github_api_addr : oschina_api_addr;
        var _comments_url = api_addr + username + '/' + repo + '/issues/' + issue_id + '/comments';
        _getIssue(issue_id, function (issue) {
            _getComment({ comments: comments,
                comments_url: _comments_url,
                page: 1 }, function (comments) {
                loading_target && spinner.spin();
                _renderHTML({
                    type: type,
                    issue: issue,
                    comments: comments,
                    comments_url: _comments_url,
                    issue_title: issue_title
                });
                loading_target && spinner.spin();
                return;
            });
        });
    }
};
