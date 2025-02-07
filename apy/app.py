import math
import os
from cluster import cluster_feedback
from dotenv import load_dotenv
from flask import request

load_dotenv()
import time

from flask import Flask

app = Flask(__name__)

@app.route('/', methods=['POST'])
def endpoint():
    post_body = request.get_json()

    print('Received feedback: ' + str(len(post_body['feedback'])))

    # print(post_body['feedback'])

    clusters = cluster_feedback(post_body['feedback'])
    print(clusters)
    
    return {'groupings': clusters}

# @app.route('/groupings', methods=['POST'])
# def endpoint():
#     post_body = request.get_json()
#     print('getting groupings')

#     return {'feedback': post_body['feedback']}
