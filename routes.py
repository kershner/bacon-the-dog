from flask import Flask, render_template
from config import credentials
import boto3
import webbrowser

app = Flask(__name__)
s3 = boto3.resource(
    's3',
    aws_access_key_id=credentials.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=credentials.AWS_SECRET_ACCESS_KEY
)

S3_BASE_URL = 'https://s3.us-east-2.amazonaws.com'


@app.route('/')
def index():
    bucket = s3.Bucket('baconthedog')
    objects = bucket.objects.all()
    for item in objects:
        s3_url = '%s/%s/%s' % (S3_BASE_URL, item.bucket_name, item.key)
        print(s3_url)
        # webbrowser.open(s3_url)

    msg = 'HELLO WORLD'
    return render_template('home.html',
                           msg=msg)


# Development server
if __name__ == '__main__':
    app.run(threaded=True)
