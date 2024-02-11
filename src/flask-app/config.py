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
        # Ensure sequence length is at least 2 and at most sequenceMaxSize
        sequence_length = random.randint(2, sequenceMaxSize)
        sequence = [random.choice(tokens) for _ in range(sequence_length)]

        # Convert sequence to a tuple for hashability in set
        sequence_tuple = tuple(sequence)

        # Use a set for faster "in" checks
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
    # Generate the matrix
    matrix = [[random.choice(tokens) for _ in range(matrix_width)] for _ in range(matrix_height)]

    # Generate unique sequences
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
# buff,mat,seqlist,scorelist = readfile("tes.txt")
# start = time.time()
# resultspath,resultscore,position=find_seq(buff,mat, 0, 0, "vertical",seqlist,scorelist)
# print(resultscore)
# print(resultspath)
# print(position)
# end = time.time()
# print(f"Execution Time: {end - start} seconds")