# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from BruteForceAlgorithm import find_seq
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
        'result_matrix': position,
        'buffer_size': buffer_size,  
        'sequences': sequences,
        'scores': scores
    })

if __name__ == '__main__':
    app.run(debug=True)
