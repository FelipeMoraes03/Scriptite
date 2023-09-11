from flask import Flask, make_response, jsonify, request, Response
import threading
import openai
import json

from api.controllers.prompt import *
from configFlask import *

creative_cache = {
    "creative": ""
}

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

        creative_cache['creative'] = generated_creative

    threading.Thread(target=generate_stream).start()

def generate_creative_prompt(data):
    input_prompt = f"- Nome do produto: {data['product_name']}\n"
    input_prompt = input_prompt + f"- Nicho e Público-Alvo: {data['public_target']}\n"
    input_prompt = input_prompt + f"- Que Dor o publico tem: {data['pains']}\n"
    input_prompt = input_prompt + f"- Necessidade/Desejos do publico: {data['needs']}\n"
    input_prompt = input_prompt + f"- Como o produto resolve a dor:  {data['solution']}\n"
    input_prompt = input_prompt + f"- Formato do produto:  {data['product_format']}\n"
    input_prompt = input_prompt + f"- Diferencial: {data['diferential']}\n"
    input_prompt = input_prompt + f"- Objetivos do produto:  {data['product_objectives']}\n"
    input_prompt = input_prompt + f"- Preço da oferta: {data['price']}\n"

    creative_prompt = PROMPT_CREATIVE + input_prompt

    return creative_prompt

def get_creative():
    return make_response(
        jsonify(creative=(creative_cache['creative']).replace("\n", "<br>"))
    )