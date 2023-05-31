from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

image_urls = []

@app.route('/process_images', methods=['GET', 'POST'])
def process_images():
    global image_urls # ensure we are modifiyng the global variable
    print("Images Sent to Server")
    # print(image_urls)
    if request.method == 'POST':
        image_urls = request.json.get('imageUrls', [])
    elif request.method == 'GET':
        print("Images Sent to Notebook")
    return jsonify(image_urls)

if __name__ == "__main__":
    app.run(port=5000)
