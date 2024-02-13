from helper import pathToWord
from helper import path_printer
from BruteForceAlgorithm import find_seq
import time
def readfile(file_path):
    matrixInput = False
    count = 0
    Matrix = []
    seqlist = []
    scorelist = []
    with open(file_path, 'r') as file:
        lines = file.readlines()
        buffer_size = int(lines[0].strip())
        matrix_width = int((lines[1].strip().split())[0])
        matrix_height = int((lines[1].strip().split())[1])
        for i in range(2,2+matrix_height):
            rows = lines[i].strip().split()
            if (len(rows) == matrix_width):
                Matrix.append(rows)
            else:
                print("error in reading file")
                return 0,[],[],[]
        seqnum = int(lines[2+matrix_height].strip())
        for x in range(3+matrix_height,len(lines),2):
            seqword = pathToWord(lines[x].strip())
            seqword = ''.join(seqword.split())
            score = int(lines[x+1].strip())
            seqlist.append(seqword)
            scorelist.append(score)
    return buffer_size,Matrix,seqlist,scorelist
# readfile("tes.txt")
import random

import random

def generate_unique_sequences(tokens, sequenceCount, sequenceMaxSize):
    sequences = []

    while len(sequences) < sequenceCount:
        sequence_length = random.randint(2, sequenceMaxSize)
        sequence = [random.choice(tokens) for _ in range(sequence_length)]
        sequence_tuple = tuple(sequence)
        existing_sequences = {tuple(seq) for seq in sequences}
        if sequence_tuple not in existing_sequences:
            sequences.append(sequence)
    return sequences

def generate_scores(sequence_count):
    scores = set()
    while len(scores) < sequence_count:
        scores.add(random.randint(0, 100))
    return list(scores)

def generate_matrix_and_sequences(tokens, sequenceCount, matrix_width, matrix_height, sequenceMaxSize):
    matrix = [[random.choice(tokens) for _ in range(matrix_width)] for _ in range(matrix_height)]
    sequences = generate_unique_sequences(tokens, sequenceCount, sequenceMaxSize)
    scores = generate_scores(sequenceCount)
    return matrix, sequences, scores



# tokens = ['A', 'B', 'C', 'D', '1', '2', '3']
# sequenceCount = 5
# matrix_width = 4
# matrix_height = 4
# sequenceMaxSize = 3

# matrix, sequences,scores = generate_matrix_and_sequences(tokens, sequenceCount, matrix_width, matrix_height, sequenceMaxSize)

# print("Generated Matrix:")
# for row in matrix:
#     print(row)

# print("\nGenerated Sequences:")
# for sequence in sequences:
#     print(sequence)

# print(scores)

def save_results_to_file(total_score, results_path, positions,runtime,filename="result.txt"):
    formatted_results_path = " ".join([results_path[i:i+2] for i in range(0, len(results_path), 2)])
    runtime_ms = runtime * 1000
    with open(filename, "w") as file:
        file.write(f"{total_score}\n")
        file.write(f"{formatted_results_path}\n")
        for position in positions:
            file.write(f"{position}\n")
        file.write(f"{runtime_ms:.2f} ms\n")


# buff,mat,seqlist,scorelist = readfile("tes.txt")
# start = time.time()
# resultspath,resultscore,position=find_seq(buff,mat, 0, 0, "vertical",seqlist,scorelist)
# end = time.time()
# timer = end-start
# save_results_to_file(resultscore,resultspath,position,timer)
# print(resultscore)
# print(resultspath)
# print(position)
# print(f"Execution Time: {end - start} seconds")