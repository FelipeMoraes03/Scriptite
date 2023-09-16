from flask import Flask, make_response, jsonify, request, Response
from flask_cors import CORS
from flask_socketio import SocketIO
import threading
import openai
import json

from api import api
from configFlask import *

#from prompt import PROMPT_TESTE

with open('./credentials.json', 'r') as f:
    credentials = json.load(f)

openai.api_key = credentials['openai_api_key']
openai.Model.list()

if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5001, debug=True)