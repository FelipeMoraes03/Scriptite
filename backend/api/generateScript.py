from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import openai
import json

MODEL_GPT = 'gpt-4'
with open('backend/credentials.json', 'r') as f:
    credentials = json.load(f)

openai.api_key = credentials['openai_api_key']
openai.Model.list()

app = Flask(__name__)
app.json.sort_keys = False
CORS(app)

@app.route('/generate-creative', methods=['POST'])
def generate_creative():
    sys_behavior = ""
    data = request.json
    prompt_input = data['prompt']
    print(prompt_input)

    with open("backend/api/promptCreative.txt", "r", encoding="utf-8") as f:
        gpt_prompt = f.read()

    gpt_response = openai.ChatCompletion.create(
        model = MODEL_GPT,
        messages = [
            #{"role": "system", "content": sys_behavior},
            {"role": "user", "content": gpt_prompt}
        ],
        temperature = 0.7,
    )

    generated_creative = str(gpt_response['choices'][0]['message']['content'])

    print(generated_creative)

    return make_response(
        jsonify(message='CRIATIVO:', creative=generated_creative)
    )

if __name__ == "__main__":
    app.run()