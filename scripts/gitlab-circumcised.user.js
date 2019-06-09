// ==UserScript==
// @name		Gitlab Hebrew (RTL) support
// @author		(David *)Frenkiel
// @namespace	http://intelligym.com
// @description	Add Hebrew display to gitlab ticket pages
// @match		https://gitlab.com/*/issues/*
// @match		https://gitlab.com/intelligym/*/issues/*
// @require	 http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @version	 1.01
// @updateURL   http://media.intelligym.com/download/misc/gitlab-circumcised.user.js
// @downloadURL http://media.intelligym.com/download/misc/gitlab-circumcised.user.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_log
// @grant GM_info
// ==/UserScript==

(function ($) {
	"use strict";
	
	function kofTrace() {
	//	return;
		var len = arguments.length,
			arr, i;
		if (0 === len) {
			return;
		}
		arr = new Array(len);
		for (i = 0; i < len; ++i) {
			arr[i] = arguments[i];
		}
		GM_log(arr.join(' '));
	}

	var imgSrc = "data:image/gif;base64,R0lGODlhLAAsAMQfAFdeZBpnsPLz8u7Sl76NTtHS0KRZKbO1s4CEhyGH0EyXzkhPU116mZS/4ti5fhI+fXBzcHtZOD9DQy84MWet4ODh4MPc8HyduYlEA5Kba/XdrZ2fnKipp5GTk8DCwf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkQwNUI2OEJBMEFCMTFFNUIyRTlFMkNFMjM4Mjg4OTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkQwNUI2OENBMEFCMTFFNUIyRTlFMkNFMjM4Mjg4OTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyRDA1QjY4OUEwQUIxMUU1QjJFOUUyQ0UyMzgyODg5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyRDA1QjY4QUEwQUIxMUU1QjJFOUUyQ0UyMzgyODg5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAB8ALAAAAAAsACwAAAX/4CeOZClURVqta1oIZSzPYuVVQq7vuQvTwJENxyvmcLZCkCa4IY1F5Oq2LBWcK6iRVbB5qqIri6jlSV2HqqvL2pJ33JTnC5x7VFndAcF4PBYPAAwHRHF2HDQFB3N4SB2AAQwXDQ0UDAF+CC8tch6LMgIbdngCB4AJDRaqqxaUfQ8dLAeLsxwVMRyzjCoIDwGTlK2UwxQUCpgQVw+atRs/YRu5uxW9kQrFCtkMANbXCgmYAAAPyc10Ih0cuYs3vQ8J2QkMDRUOBhj4HZfwAZh+AJ7Ubejwo0KHaLoKcPCToCGqE/fwTcBgwACCb+D6BQrIoUMHJR8GImQ3LoDDLg7w/6lc6aCAyYwbD3AY6PGDAI8bEHro4OvlnYgrKUaEwMChv2YdECAQUAABTmmQGjYocM8AgYr4CDjYGuFdQ40LZOZMCsGT0oO5NvQEl+EegQFw7RHQEBfCggWXLuEV6BEBhJlncx6A4KshAAIY3sIdoMEBY7qMETsgwE7mzKR+lUJwirZkwwgpFcfV0DiD4wEpJ6/jSxbC5s2cOUQNoBWD49ILHGdYAIFuagIEPInF7Lo47Jx+khsYkNg3hAkZNACYAGFxYgwMFDBgAKGvawDGA2e+0AG0VcgToGt4Hh0u4ggYM2mGII6+68DqckG4d1pDhgwDVNAYY46llME3/ijll/844IEHG07RqBMBBouRZqGFAxjgmEUO/TEfALwhUN+DSpF3AQIRHNDWbaShhphiBkDwVSB+0QfiXwuM6JQfL33FwFUVBWnVaYghiMyCIC7wUY4ObuaZQwwsttWUBW4V44zL2AiiBB4IcFeOxfXRYwCJoUYlle8ZRc53SUoAAwJ3jShmP/BAQBFweAIXEXwzCmLjXRJAEIYEEsQpSHI9MjBhUBhEEEF2WCIJKJcjQEBojrwlV1hD2nFnXHYUdJilOJMu8IwHE1ya4zYIYNKjNxdcU4wxx2RC6paEpkGCpYQWatcCIvIIj6yzxoPJAhckOekEAMRQgQTp9VpooO5smk2VPMkxgEChXxKa6i0xoJpqqtICu42mmuIloqq9pofIDBukR660E/DmGnfbEUUfuQvQOwECQXQQrbTt8tuvt5dO6+2/VQg877T9HkzwlxLLCzAYB0DLLcUcd1zwBO+C8UEFz6n6JYgoM7gssyCJPMIB03GLMpMz9xttyC6X4IGlBncLbXoAHPBMzqAc0AGuvQKAACEihwAAOw==",
		ltrSrc = "data:image/png;base64,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",
		rtlSrc = "data:image/png;base64,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",
		scriptVersion, aceUser,
		pageStyle = ".lang-button { floatL: left; width: 28px; height: 28px; background-size: 100%; display: inline-block; cursor: pointer; } .update-icon {position: fixed; z-index: 1; margin: 0; top: 4px; right: 200px; } .update-icon:hover { background-color: transparent; outline:0; } .update-icon:active { margin: 2px -2px 0px 0px; outline:0;} .update-icon:link, .update-icon:visited { border-bottom: none;}";

	function hasHeb(str) {
		return str && str.match(/[\u0591-\u05F4]/);
	}

	function addAceUI() {
		var img = $("<img />"),
			$logo = $("div.header-logo");
		img.attr({
			src: imgSrc
		});
		var link = $("<a />");
		link.attr({
			"href": "#",
			"class": "update-icon",
			title: "Update to the latest version\n(current monkey version: " + scriptVersion + ")"
		});
		link.click(function (e) {
			e.preventDefault();
			e.stopPropagation();
			location.href = "http://media.intelligym.com/download/misc/gitlab-circumcised.user.js";
		});
		link.append(img);
		$logo.after(link);
		
		$("body").append($('<p class="left ace-footer">ACE extensions<br/>Version ' + scriptVersion + '</p>'));
	}

	function cancelEvent(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} 
		else {
			e.returnValue = false;
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}

	function processDescription(div) {
		if (hasHeb(div.innerHTML)) {
			$(div).attr("dir", "rtl")
				.css({
					direction: "rtl",
					"text-align": "right"
				});
		}
	}

	function toggleDir($t, $btn) {
		var dir = $t.attr("dir");
		if ("rtl" === dir) {
			$t.attr("dir", "ltr")
				.css({
					"text-align": "left",
					"direction": "ltr"
				});
			$btn.css( {
				"background-image": "url(" + ltrSrc + ')'
			});
		}
		else {
			$t.attr("dir", "rtl")
				.css({
					"text-align": "right",
					"direction": "rtl"
				});
			$btn.css( {
				"background-image": "url(" + rtlSrc + ')'
			});
		}
	}

	function processTextArea($te, $toolbar) {
		var $btn = $('<div class="lang-button"></div>'),
			f = function (e) {
				cancelEvent(e);
				toggleDir($te, $btn);
				return false;
			};
		$btn.click(f);
		$toolbar.prepend($btn);
		kofTrace("appended button, toolbar", $toolbar.attr("id"), "length is", $toolbar.children().length);
		if (hasHeb($te.val())) {
			toggleDir($te, $btn);
		}
		else {
			$btn.css({
				"background-image": "url(" + rtlSrc + ')'
			});
		}
	}

	
	function tracHeb() {
		var doc = unsafeWindow.document, 
			$body = $(doc.body),
			divs, len, i, div, cname,
			$mds = $body.find(".md-area"),
			comments = $body.find(".note-text, .note-text p, .wiki, .wiki p");
		
		comments.each(function(i, comment) {
			processDescription(comment);
		});
		kofTrace("about to process", len, "elements");
		$mds.each(function(i, md) {
			var $md = $(md),
				$tbs = $md.find(".toolbar-group"),
				$toolbar, $te, 
				$tes = $md.find("textarea");
			if ($tbs.length && $tes.length) {
				$toolbar = $($tbs[0]);
				$te = $($tes[0]);
//			toolbars[len].setAttribute("id", (toolbars[len].getAttribute("id") || "tb_") + len);
				processTextArea($te, $toolbar);
			}
		});
	}

	function updateStyles() {
		GM_addStyle(pageStyle);
	}
	
	function collectInfo() {
		var itype = typeof GM_info,
			info = (itype === "function") ? GM_info() : "";
		
		scriptVersion = (info && info.script && info.script.version) || "unknown";		
	}

	function processPage() {
		collectInfo();
//		var url = location.href;
		updateStyles();
		addAceUI();
		tracHeb();
	}
	
	kofTrace("RTL script running");
	window.setTimeout(processPage, 700);
}($));