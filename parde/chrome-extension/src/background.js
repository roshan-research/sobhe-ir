
var server = 'http://api.sobhe.ir:3800/';
var safeties = {};
var targetImage;
var contextImageFiltered;


var imageSafeties = function(images, sendResponse) {

	newImages = images.filter(function(image) { return needsChecking(image) && !(image in safeties); });

	if (!newImages.length) {
		results = {};
		images.forEach(function(image) { results[image] = safeties[image]; });
		sendResponse(results);
		return false;
	}

	$.ajax({
		url: server +'api/images_safety/',
		contentType: 'application/json',
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({images: newImages, wait: false}),
		context: {images: images, sendResponse: sendResponse},
		success: function(data){
			try {
				for (var url in data)
					safeties[url] = data[url];

				results = {};
				images.forEach(function(image) { if (safeties[image] !== undefined) results[image] = safeties[image]; });
				sendResponse(results);
			} catch (e) {}
		}
	});

	return true;
};


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type == 'image_safeties')
		return imageSafeties(request.images, sendResponse);
	else if (request.type == 'image_context') {
		contextImageFiltered = request.filtered;
		chrome.contextMenus.update(cmid, {title: contextImageFiltered ? 'This Image is Safe' : 'Cover This Image'});
	}
});


// Context Menu

var cmid = chrome.contextMenus.create({title: 'Cover This Image', contexts:['image'], onclick: function(info, tab) {
	$.post(server +'report/', {url: info.srcUrl, is_safe: String(contextImageFiltered)});
	if (!contextImageFiltered)
		chrome.tabs.sendMessage(tab.id, {type: 'cover'});
}});


// Prcoessing Badge

chrome.browserAction.setBadgeText({text: ''});
chrome.browserAction.setBadgeBackgroundColor({ color: '#626ecc'});

$(document).ajaxStart(function() {
	chrome.browserAction.setBadgeText({text: '...'});
});

$(document).ajaxStop(function() {
	chrome.browserAction.setBadgeText({text: ''});
});


// Ignoring some urls

var ignoredUrls = ['http://192.168', 'http://127.0.0.1', 'https://www.google.com/webpagethumbnail', 'https://parde-browser.herokuapp.com'];

if (typeof String.prototype.startsWith != 'function')
	String.prototype.startsWith = function (str){
		return this.indexOf(str) === 0;
	};

var needsChecking = function(src) {
	if (/\.(svg|gif|data\:image)/.test(src))
		return false;

	for (var i in ignoredUrls)
		if (src.startsWith(ignoredUrls[i]))
			return false;

	return true;
};
