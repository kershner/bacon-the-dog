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

    image_urls = []
    objects = bucket.objects.all()
    for item in objects:
        if not item.key.endswith('.webm'):
            s3_url = '%s/%s/%s' % (S3_BASE_URL, bucket_name, item.key)
            image_urls.append(s3_url)

    shuffle(image_urls)
    return render_template('home.html',
                           hero_key=hero_key,
                           image_urls=json.dumps(image_urls),
                           bucket_name=bucket_name,
                           s3_base_url=S3_BASE_URL)


# Development server
if __name__ == '__main__':
    app.run(threaded=True)
