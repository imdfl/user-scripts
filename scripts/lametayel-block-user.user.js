/**
  The MIT License (MIT)

  Copyright (c) 2019 (David *)Frenkiel

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @name        Block Lametayel User
// @namespace   imdfl
// @description Hide posts of users in lametayel forum pages
// @include     *
// @version     1.0.0
// @match		https://community.lametayel.co.il/topic/*
// @icon    	https://www.lametayel.co.il/misc/html5/header/images/logos/lametayel.png?v20181218
// @grant       GM_info
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://gist.github.com/imdfl/user-scripts/1.user.js
// @updateURL   https://gist.github.com/imdfl/user-scripts/1.user.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// ==/UserScript==

/**
 * Get a list of ignored users
 */

"use strict";

var $ = window.jQuery;
var ignoredUsers = { };
var IGNORED_KEY = "ignored_users";

function createStyle() {
	var style = document.createElement("style");
	style.innerHTML = ".lm_ig_ui { cursor: pointer; padding: 2px 5px; }; .lm_ig_add { background-color: #ddddff; } .lm_ig_remove { background-color: #ddffdd;}";
	document.body.appendChild(style);
}

function getIgnoredUsers() {
	return GM.getValue(IGNORED_KEY).then(function(str) {
		try {
			ignoredUsers = str ? JSON.parse(str) : {};
			console.log("Loaded ignored users", ignoredUsers);
		}
		catch(e) {
			console.error("Error retrieving lametayel ignored users", e);
			ignoredUsers = {};
		}
	});
}

function save() {
	GM.setValue(IGNORED_KEY, JSON.stringify(ignoredUsers))
		.then(function(result) {
			console.log("saved ignore list");
		});
}

function ignoreUser(id, name)  {
	if (id) {
		ignoredUsers[id] = name || "unknown";
		save();
	}
}

function unignoreUser(id)  {
	if (id) {
		ignoredUsers[id] = undefined;
		save();
	}
}

/**
 * find all posts by ignored users
 */
function findAllPosts() {
	return $("[component='post'][data-uid]").toArray();
}

function findAuthorNodes() {
	return $();
}

function getUserFromNode(node) {
	if (!node) {
		return null;
	}
	
	var authorNode = $(node).find("[itemprop='author'][data-username][data-uid]");
	if (!authorNode.length) {
		console.warn("failed to find author in post");
		return null;
	}
	var n = authorNode[0];
	return {
		node: n,
		id: n.getAttribute("data-uid"),
		name: n.getAttribute("data-username") || "unknown"
	};
	
}

function ignorePost(n, userData) {
	console.log("ignorePost", n, userData);
	$(userData.node).after($('<span class="lm_ig_remove lm_ig_ui" data-uid="' + userData.id + '" title="הפסק להתעלם / stop ignoring">-</span>'));
	console.log("added remove UI to user node", userData.node);
	$(n).find(".lm_ig_remove").click(function(evt) {
		evt && evt.preventDefault();
		var $n = $(evt.currentTarget);
		console.log("ignore button clicked for", $n.attr("data-uid"));
		unignoreUser($n.attr("data-uid"));
	})

}

function updatePost(node) {
	console.log("update post", node);
	var userData = getUserFromNode(node);
	if (!userData) {
		return;
	}
	var ignored = userData.id in ignoredUsers;
	if (ignored) {
		console.log("found ignored user", userData);
		ignorePost(node, userData);
	}
	else {
		console.log("Added ignore UI to node", userData.node);
		$(userData.node).after($('<span class="lm_ig_add lm_ig_ui" data-uid="' + userData.id + '" title="Ignore this user / התעלם ממשתמש זה">+</span>'));

		$(node).find(".lm_ig_add").click(function(evt) {
			evt && evt.preventDefault();
			var $n = $(evt.currentTarget);
			console.log("ignore button clicked for", $n.attr("data-uid"));
			ignoreUser($n.attr("data-uid"), $n.attr("data-username"));
			
		})
	}

}

function updatePage() {
	console.log("Updating Block lametayel users");
	var posts = findAllPosts();
	console.log("Found", posts.length, "posts");
	posts.forEach(function(n) {
		updatePost(n);
	});

}

function main() {
	createStyle();
	getIgnoredUsers().then(updatePage);
}


main();
