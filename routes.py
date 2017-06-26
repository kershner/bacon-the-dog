from flask import Flask, render_template
from config import credentials
from random import shuffle
import boto3
import json

app = Flask(__name__)
s3 = boto3.resource(
    's3',
    aws_access_key_id=credentials.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=credentials.AWS_SECRET_ACCESS_KEY
)

S3_BASE_URL = 'https://s3.us-east-2.amazonaws.com'


@app.route('/')
def index():
    bucket_name = 'baconthedog'
    bucket = s3.Bucket(bucket_name)
    hero_key = 'bacon-hero-vid.webm'
    first_photo = S3_BASE_URL + '/' + bucket_name + '/first_photo.jpg'

    image_urls = []
    objects = bucket.objects.all()
    for item in objects:
        if 'hero-vid' not in item.key:
            s3_url = '%s/%s/%s' % (S3_BASE_URL, bucket_name, item.key)
            image_urls.append(s3_url)
    shuffle(image_urls)

    found_gifs = False
    first_page = image_urls[:15]
    first_page_gifs = []
    for i, url in enumerate(first_page):
        if url.endswith('.gif'):
            found_gifs = True
            first_page_gif = {
                'index': i,
                'url': url
            }
            first_page_gifs.append(first_page_gif)

    if found_gifs:
        image_urls = filter_first_page_gifs(image_urls, first_page_gifs)

    return render_template('home.html',
                           hero_key=hero_key,
                           image_urls=json.dumps(image_urls),
                           bucket_name=bucket_name,
                           s3_base_url=S3_BASE_URL,
                           first_photo=first_photo)


# Replace first page GIFs with next available non-GIFs for faster initial page load
def filter_first_page_gifs(image_urls, first_page_gifs):
    non_gifs = []
    after_first_page = image_urls[15:]
    for url in after_first_page:
        if len(non_gifs) < len(first_page_gifs):
            if not url.endswith('.gif'):
                non_gif = {
                    'index': image_urls.index(url),
                    'url': url
                }
                non_gifs.append(non_gif)
        else:
            break

    for i, non_gif in enumerate(non_gifs):
        first_page_gif = first_page_gifs[i]
        # Swap first page GIF with next non-GIF from image_urls
        image_urls[first_page_gif['index']], image_urls[non_gif['index']] = non_gif['url'], first_page_gif['url']

    return image_urls


# Development server
if __name__ == '__main__':
    app.run(threaded=True)
