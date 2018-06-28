
var minSafety = 0.5;
var minSize = 50;
var pardeSVG = chrome.extension.getURL("/src/parde.svg");
var targetImage;
var processedImages = [];


var uncover = function(image) {
	image.src = image.getAttribute('parde-filtered');
	image.removeAttribute('parde-filtered');
}

var cover = function(image) {
	style = 'width:'+image.width+'px;height:'+image.height+'px;';
	if (!image.hasAttribute('style'))
		image.setAttribute('style', style);
	else
		image.setAttribute('style', image.getAttribute('style') +';'+ style);

	image.setAttribute('parde-filtered', image.src);
	image.src = pardeSVG;
}


var queryImages = function () {
	newImages = [];

	for (i = 0; i < document.images.length; i++) {
		image = document.images[i];
		if (image.src && processedImages.indexOf(image.src) < 0 && newImages.indexOf(image.src) < 0 && image.width > minSize && image.height > minSize)
			newImages.push(image.src);
	}

	if (!newImages.length)
		return;

	chrome.extension.sendMessage({type: 'image_safeties', images: newImages}, function(response) {
		for (url in response) {
			processedImages.push(url);
			if (response[url] === null || response[url] >= minSafety)
				continue;

			for (i = 0; i < document.images.length; i++)
				if (document.images[i].src == url) {
					cover(document.images[i]);
					break;
				}
		}
	});
};


document.body.addEventListener('contextmenu', function(e) {
	if(e.target && e.target.nodeName == "IMG") {
		targetImage = e.target;
		filtered = targetImage.hasAttribute('parde-filtered');

		if (filtered)
			uncover(targetImage);

		chrome.extension.sendMessage({type: 'image_context', filtered: filtered});
	}
});


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type == 'cover')
		cover(targetImage);
});


queryImages();
setInterval(queryImages, 5000);
