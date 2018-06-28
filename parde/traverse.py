# coding: utf8

from __future__ import unicode_literals

server_url = 'http://10.1.31.135:8080/cue/services/rest/'
files_dir = '/data/uncensored_films/dst/'

import requests

def label_frame(urn, frame, label):
	request_url = 'insert?location={"storage":"dst","urn":["%s"]}&startFrame=%d&endFrame=%d&totalFrame=1&title=%s' % (urn, frame, frame, label)
	result = requests.get(server_url + request_url)
	print(result.content)


# find images

import os

images = []
for root, dirs, files in os.walk(files_dir):
	for file in files:
		if file.endswith(".jpg"):
			images.append(os.path.join(root, file))

urls = images


# process images

from images.models import *
from images.tasks import process_images
from celery import group

all_new_urls = set(urls) - set(Image.objects.filter(url__in=urls).values_list('url', flat=True))
segment = lambda items, size: [items[x:x+size] for x in range(0, len(items), size)]

for new_urls in segment(list(all_new_urls), 200):
	Image.objects.bulk_create([Image(url=url) for url in new_urls])
	group([process_images.s(items) for items in segment(list(new_urls), 10)])().get()

	# inform server
	for image in Image.objects.filter(url__in=new_urls):
		parts = image.url[len(files_dir):].split('/')
		_frame = parts[1][6:-4]
		frame = int(_frame) if _frame else 0

		label_frame(parts[0], frame, 'امنیت اخلاقی: {0}'.format(int(image.safety*100)))
		if image.safety <= .3:
			label_frame(parts[0], frame, 'نامناسب')
