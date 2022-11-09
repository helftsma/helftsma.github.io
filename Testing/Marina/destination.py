from flask import Flask, jsonAify, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# cors = CORS(app, resources={r"/destination": {"origins": "*"}})
# app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Access-Control-Allow-Origin'


@app.route('/index', methods=['POST'])
@cross_origin()
def destination():
    jsdata = request.get_data()
    run_user_script(jsdata)
    return jsdata


def run_user_script(user_script):
    print("Running user script...")
    exec(user_script)


app.run(debug=True)
