from operator import ge
from flask import Flask, make_response, jsonify, request, Response
from flask_cors import CORS
from flask_socketio import SocketIO
import threading
import openai
import json

MODEL_GPT = 'gpt-4'
with open('backend/credentials.json', 'r') as f:
    credentials = json.load(f)

openai.api_key = credentials['openai_api_key']
openai.Model.list()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
app.json.sort_keys = False
CORS(app)

content_cache = {
    "creative": "",
    "script": "",
    "story_board": ""
}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('generate_creative')
def generate_creative_stream(data):
    prompt = generate_creative_prompt(data)

    gpt_response = openai.ChatCompletion.create(
        model=MODEL_GPT,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        stream=True,
    )

    def generate_stream():
        generated_creative = ""
        with app.app_context():
            for chunk in gpt_response:
                if chunk['choices'][0]['delta'] != {}:
                    creative_chunk = chunk['choices'][0]['delta']['content']
                    socketio.emit('creative_chunk', {"creative": creative_chunk})
                    generated_creative += creative_chunk
            socketio.emit('creative_streaming_complete')

        content_cache['creative'] = generated_creative

    threading.Thread(target=generate_stream).start()

def generate_creative_prompt(data):
    with open("backend/api/promptCreative.txt", "r", encoding="utf-8") as f:
        base_prompt = f.read()

    input_prompt = f"- Nome do produto: {data['product_name']}\n"
    input_prompt = input_prompt + f"- Nicho e Público-Alvo: {data['public_target']}\n"
    input_prompt = input_prompt + f"- Que Dor o publico tem: {data['pains']}\n"
    input_prompt = input_prompt + f"- Necessidade/Desejos do publico: {data['needs']}\n"
    input_prompt = input_prompt + f"- Como o produto resolve a dor:  {data['solution']}\n"
    input_prompt = input_prompt + f"- Formato do produto:  {data['product_format']}\n"
    input_prompt = input_prompt + f"- Diferencial: {data['diferential']}\n"
    input_prompt = input_prompt + f"- Objetivos do produto:  {data['product_objectives']}\n"
    input_prompt = input_prompt + f"- Preço da oferta: {data['price']}\n"

    creative_prompt = base_prompt + input_prompt

    return creative_prompt

@app.route('/creative', methods=['GET'])
def get_creative():
    return make_response(
        jsonify(creative=(content_cache['creative']).replace("\n", "<br>"))
    )

@socketio.on('generate_script')
def generate_cript_stream(data):
    prompt = generate_script_prompt(data)
    
    gpt_response = openai.ChatCompletion.create(
        model=MODEL_GPT,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        stream=True,
    )

    def generate_stream():
        generated_script = ""
        with app.app_context():
            for chunk in gpt_response:
                if chunk['choices'][0]['delta'] != {}:
                    script_chunk = chunk['choices'][0]['delta']['content']
                    socketio.emit('script_chunk', {"script": script_chunk})
                    generated_script += script_chunk
            socketio.emit('script_streaming_complete')

        content_cache['script'] = generated_script

    threading.Thread(target=generate_stream).start()

def generate_script_prompt(data):
    with open("backend/api/promptScript.txt", "r", encoding="utf-8") as f:
        base_prompt = f.read()

    script_prompt = base_prompt + data['creative']

    return script_prompt

@app.route('/script', methods=['GET'])
def get_script():
    return make_response(
        jsonify(script=(content_cache['script']).replace("\n", "<br>"))
    )

if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5001, debug=True)