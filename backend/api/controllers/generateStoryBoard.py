from flask import Flask, make_response, jsonify, request, Response
import threading
import openai
import json

from api.controllers.prompt import *
from configFlask import *

story_board_cache = {
    "story_board": []
}

def generate_scene_prompt(data, client_sid):
    prompt = PROMPT_STORY_BOARD + data['script']
    #prompt = PROMPT_STORY_BOARD + PROMPT_TESTE

    gpt_response = openai.ChatCompletion.create(
        model=MODEL_GPT,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        stream=True,
    )

    def generate_stream():
        generated_story_board = ""
        with app.app_context():
            for chunk in gpt_response:
                if chunk['choices'][0]['delta'] != {}:
                    story_board_chunk = chunk['choices'][0]['delta']['content']
                    socketio.emit('story_board_chunk', {"story_board": story_board_chunk}, room=client_sid)
                    generated_story_board += story_board_chunk
            socketio.emit('story_board_streaming_complete', room=client_sid)
        
        print(generated_story_board)

    threading.Thread(target=generate_stream).start()

def generate_scene_image():
    data = request.json
    prompt = data['scene'].replace("\n", "<br>")

    response = openai.Image.create(
        prompt = prompt,

        n = 1,

        size = "1024x1024"
    )
    image_url = response['data'][0]['url']

    print(image_url)
    tupla = (prompt[0], image_url)
    story_board_cache['story_board'].append(tupla)

    return make_response(
        jsonify(scene=tupla)
    )

def get_story_board():
    return make_response(
        jsonify(story_board=(story_board_cache['story_board']))
    )