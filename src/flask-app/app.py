from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from BruteForceAlgorithm import find_seq
from config import generate_matrix_and_sequences
from helper import pathToWord
from config import readfile
import os
import time
# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for development ease

UPLOAD_FOLDER = 'Uploaded'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload folder exists
print("tes")
@app.route('/calculate', methods=['POST'])
def calculate():
    print("tes")
    data = request.get_json()
    matrix = data['matrix']
    buffer_size = data.get('bufferSize', 1)  
    sequences = data.get('sequences', [])
    scores = data.get('scores', [])
    start = time.time()
    print(sequences)
    resultspath, resultscore, position = find_seq(buffer_size, matrix, 0, 0, "vertical", sequences, scores) 
    end = time.time()
    gap = (end-start) * 1000
    return jsonify({
        'result_path':resultspath,
        'result_scores': resultscore,
        'initial_matrix': matrix,
        'result_matrix': position,
        'buffer_size': buffer_size,  
        'sequences': sequences,
        'scores': scores,
        'time':gap
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
    matrix, sequences, scores = generate_matrix_and_sequences(tokens, num_seq, matrix_width, matrix_height, max_sequence_size)
    sequencescombined = [pathToWord(x) for x in sequences]
    start = time.time()
    resultspath, resultscore, position = find_seq(buffer_size, matrix, 0, 0, "vertical", sequencescombined, scores) 
    end = time.time()
    gap = (end-start)*1000
    return jsonify({
        'result_path':resultspath,
        'initial_matrix': matrix,
        'result_matrix': position,
        'buffer_size': buffer_size,  
        'sequences': sequencescombined,
        'result_scores': resultscore,
        'scores':scores,
        'time':gap
    })

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part', 'status': 'failed'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file', 'status': 'failed'}), 400
    if file and file.filename.endswith('.txt'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        print("upload done")
        try:
            buffer_size, matrix, sequences, scores = readfile(filepath)
            width = len(matrix[0])
            height = len(matrix)
            return jsonify({
                'message': 'File uploaded and processed successfully',
                'filepath': filepath,
                'buffer_size': buffer_size,
                'matrix': matrix,
                'sequences': sequences,
                'scores': scores,
                'status': 'success',
                'width':width,
                'height':height
            }), 200
        except Exception as e:
            print(f"Error processing file: {e}")
            return jsonify({
                'message': 'Error processing the uploaded file',
                'status': 'failed'
            }), 500
    else:
        return jsonify({'message': 'Invalid file type, only .txt files are accepted', 'status': 'failed'}), 400

if __name__ == '__main__':
    app.run(debug=True)
