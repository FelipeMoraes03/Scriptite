from operator import ge
from flask import Flask, make_response, jsonify, request, Response
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

    gpt_prompt = generate_creative_prompt(data)

    print(gpt_prompt)

    gpt_response = openai.ChatCompletion.create(
        model = MODEL_GPT,
        messages = [
            #{"role": "system", "content": sys_behavior},
            {"role": "user", "content": gpt_prompt}
        ],
        temperature = 0.7,
        #stream = True,
    )

    generated_creative = str(gpt_response['choices'][0]['message']['content'])
    print(generated_creative)
    generated_creative = generated_creative.replace("\n", "<br>")
    
    return make_response(
        jsonify(message='CRIATIVO:', creative=generated_creative)
    )

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

@app.route('/generate-creative/streaming', methods=['POST'])
def generate_creative_stream():
    data = request.json
    gpt_response = openai.ChatCompletion.create(
        model = MODEL_GPT,
        messages = [
            #{"role": "system", "content": sys_behavior},
            {"role": "user", "content": data['prompt']}
        ],
        temperature = 0.7,
        stream = True,
    )

    def generate_stream():
        with app.app_context():
            yield '{"message": "CRIATIVO:"}\n'
            for chunk in gpt_response:
                if (chunk['choices'][0]['delta'] != {}):
                    print(chunk['choices'][0]['delta']['content'], end='')
                    yield (json.dumps({"creative": chunk['choices'][0]['delta']['content']}))
            yield '\n'
            print("")

    return Response(generate_stream(), content_type='text/plain')

if __name__ == "__main__":
    app.run()