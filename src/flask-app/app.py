# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from BruteForceAlgorithm import find_seq
from config import generate_matrix_and_sequences
from helper import pathToWord
app = Flask(__name__)
CORS(app)  # Enable CORS for development ease

@app.route('/multiply', methods=['POST'])
def multiply_matrix():
    data = request.get_json()
    matrix = data['matrix']
    buffer_size = data.get('bufferSize', 1)  
    sequences = data.get('sequences', [])
    scores = data.get('scores', [])
    resultspath,resultscore,position=find_seq(buffer_size,matrix, 0, 0, "vertical",sequences,scores) 
    print(f"Buffer Size: {buffer_size}, Sequences: {position}, Scores: {scores}")
    return jsonify({
        'initial_matrix':matrix,
        'result_matrix': position,
        'buffer_size': buffer_size,  
        'sequences': sequences,
        'scores': scores
    })
@app.route('/random', methods=['POST'])
def generate_random():
    data = request.get_json()
    tokens = data['tokens']
    buffer_size = data['bufferSize']
    matrix_width = data['matrixWidth']
    matrix_height = data['matrixHeight']
    num_seq = data['numSeq']
    max_sequence_size = data['maxSequenceSize']
    # print(tokens)
    matrix, sequences,scores = generate_matrix_and_sequences(tokens, num_seq, matrix_width, matrix_height, max_sequence_size)
    sequencescombined = []
    for x in sequences:
        sequencescombined.append(pathToWord(x))
        print(pathToWord(x))
    resultspath,resultscore,position=find_seq(buffer_size,matrix, 0, 0, "vertical",sequencescombined,scores) 
    return jsonify({
        'initial_matrix':matrix,
        'result_matrix': position,
        'buffer_size': buffer_size,  
        'sequences': sequences,
        'scores': scores
    })
if __name__ == '__main__':
    app.run(debug=True)
