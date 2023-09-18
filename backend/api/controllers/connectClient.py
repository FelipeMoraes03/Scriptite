from flask import Flask, make_response, jsonify, request, Response
import threading
import openai
import json

from configFlask import *

connected_clients = []

def connect_client():
    client_id = request.sid
    connected_clients.append(client_id)
    print(f'Cliente conectado: {client_id}')

def disconnect_client():
    client_id = request.sid
    connected_clients.remove(client_id)
    print(f'Cliente desconectado: {client_id}')

def get_clients():
    return make_response(
        jsonify(clients=connected_clients)
    )