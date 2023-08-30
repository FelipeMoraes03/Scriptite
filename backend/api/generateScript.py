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

    gpt_prompt = generate_creative_prompt(data)

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
        jsonify(message='CRIATIVO:', creative=gpt_prompt)
    )

def generate_creative_prompt(data):
    with open("backend/api/promptCreative/promptCreative1.txt", "r", encoding="utf-8") as f:
        initial_prompt = f.read()

    with open("backend/api/promptCreative/promptCreative2.txt", "r", encoding="utf-8") as f:
        final_prompt = f.read()

    product_name = f"- Nome do produto: {data['product_name']}"
    public_target = f"- Nicho e Público-Alvo: {data['public_target']}"
    pains = f"- Que Dor o publico tem: {data['pains']}"
    needs = f"- Necessidade/Desejos do publico: {data['needs']}"
    solution = f"- Como o produto resolve a dor:  {data['solution']}"
    product_format = f"- Formato do produto:  {data['product_format']}"
    diferential = f"- Diferencial: {data['diferential']}"
    product_objectives = f"- Objetivos do produto:  {data['product_objectives']}"
    price = f"- Preço da oferta: {data['price']}"

    middle_prompt = product_name + "\n" + public_target + "\n" + pains + "\n" + needs + "\n" + solution + "\n" + product_format + "\n" + diferential + "\n" + product_objectives + "\n" + price

    creative_prompt = initial_prompt + "\n" + middle_prompt + "\n" + final_prompt

    return creative_prompt

if __name__ == "__main__":
    app.run()