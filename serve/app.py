from flask import Flask, jsonify, request, Response
import requests, json
from flask_cors import CORS
import pymongo

DEBUG = True
API_URL = 'https://jsonbox.io/box_f1b3750f0856cf59314d'


db = client.aprenda
collection = db['player']

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')

@app.route('/player', methods=['POST', 'GET', 'PUT', 'DELETE'])
def player():
  if request.method == 'GET':
    username = request.args.get('username')
    query = '?sort=-score'

    if username:
      query += '&q=username:%s' % username

    # response = 

    return Response(requests.get(API_URL+query))
  
  elif request.method == 'POST':
    playerData = request.get_data()

    # response = requests.post(API_URL, playerData, headers={'content-type': 'application/json'})
    response = collection.insert_one(playerData)

    return Response(response)
  
  elif request.method == 'PUT':
    playerData = request.get_data()
    playerId = request.args.get('id')

    response = requests.put(API_URL+'/%s' %playerId, playerData, headers={'content-type': 'application/json'})

    return Response(response)
  
  elif request.method == 'DELETE':
    playerId = str(request.args.get('id'))

    response = requests.delete(API_URL+'/%s' %playerId, headers={'content-type': 'application/json'})

    return Response(response)


if __name__ == '__main__':
    app.run()
