from flask import Flask, make_response, jsonify, request, Response
import threading
import openai
import json

from api.controllers.prompt import *
from configFlask import *

script_cache = {
    "script": ""
}

def generate_script_stream(data, client_sid):
    prompt = PROMPT_SCRIPT + data['creative']
    
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
                    socketio.emit('script_chunk', {"script": script_chunk}, room=client_sid)
                    generated_script += script_chunk
            socketio.emit('script_streaming_complete', room=client_sid)

        script_cache['script'] = generated_script

    threading.Thread(target=generate_stream).start()

def get_script():
    return make_response(
        jsonify(script=(script_cache['script']).replace("\n", "<br>"))
    )