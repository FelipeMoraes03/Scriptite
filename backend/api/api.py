from configFlask import *
from api.controllers.generateCreative import *
from api.controllers.generateScript import *
from api.controllers.generateStoryBoard import *

content_cache = {
    "creative": "",
    "script": "",
    #"script": PROMPT_TESTE,
    "story_board": []
}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('generate_creative')
def generate_creative_call(data):
    return generate_creative_stream(data)

@app.route('/creative', methods=['GET'])
def get_creative_call():
    return get_creative()

@socketio.on('generate_script')
def generate_script_call(data):
    return generate_script_stream(data)

@app.route('/script', methods=['GET'])
def get_script_call():
    return get_script()

@socketio.on('story_board')
def generate_scene_prompt_call(data):
    return generate_scene_prompt(data)

@app.route('/story-board', methods=['POST'])
def generate_scene_image_call():
    return generate_scene_image()

@app.route('/story-board', methods=['GET'])
def get_story_board_call():
    return get_story_board()