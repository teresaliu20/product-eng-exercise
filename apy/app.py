from cluster import cluster_feedback
from dotenv import load_dotenv
from flask import request, Flask

load_dotenv()

app = Flask(__name__)

@app.route('/', methods=['POST'])
def endpoint():
    post_body = request.get_json()
    clusters = cluster_feedback(post_body['feedback'])
    return {'groupings': clusters}
