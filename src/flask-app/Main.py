from config import readfile
from BruteForceAlgorithm import find_seq
from config import generate_matrix_and_sequences
from helper import pathToWord
from config import save_results_to_file
import time
print("Cyberpunk 2077 Hacking Minigame Solver")
print("===================================================================================")
print("INSTANT BREACH PROTOCOL SOLVER - START CRACKING, SAMURAI")

while True:
    print("Choose your input type:")
    print("1. Using a txt File.")
    print("2. Input Token and sequence number and let system randomize.")
    choice = input("Select your choices! ")
    if choice == '1' or choice == '2':
        break
    print("Please enter either 1 or 2!")

if choice == '1':
    while True:
        filename = input("Please enter your txt file along with its extension: ")
        try:
            buff, mat, seqlist, scorelist = readfile(filename)
            break 
        except Exception as e:
            print(f"An error occurred: {e}")
            print("Please try again!")
    start = time.time()
    resultspath, resultscore, position = find_seq(buff, mat, 0, 0, "vertical", seqlist, scorelist)
    end = time.time()
    gap = (end-start)
    print("Result Score:", resultscore)
    formatted_path = ' '.join([resultspath[i:i+2] for i in range(0, len(resultspath), 2)])
    print("Result Path:", formatted_path)
    print("Positions:")
    for pos in position:
        print(pos)
    print((gap*1000),"ms")
    save = input("Would you like to save the result (y/n) ?")
    if (save == 'y'):
        save_results_to_file(resultscore,resultspath,position,gap)
elif choice == '2':
    tokens = set()  
    tokenCount = int(input("How many tokens would you like to have: "))
    while len(tokens) < tokenCount:
        token = input(f"Enter token #{len(tokens) + 1} (max 2 characters): ")
        if len(token) == 2 and token not in tokens:
            tokens.add(token)
        else:
            print("Invalid token. It must be unique and up to 2 characters long.")
    tokens = list(tokens)
    buff = int(input("Enter max buffer size:"))
    matrix_width = int(input("Input Matrix width:"))
    matrix_height = int(input("Input Matrix height:"))
    sequenceCount = int(input("How many sequence would you like to have:"))
    sequenceMaxSize = int(input("Input Sequence Max Size:"))
    matrix, sequences, scores = generate_matrix_and_sequences(tokens,sequenceCount,matrix_width,matrix_height,sequenceMaxSize)
    sequences = [pathToWord(x) for x in sequences]
    start = time.time()
    resultspath, resultscore, position = find_seq(buff, matrix, 0, 0, "vertical", sequences, scores)
    end = time.time()
    gap = (end-start)
    print("Result Score:", resultscore)
    formatted_path = ' '.join([resultspath[i:i+2] for i in range(0, len(resultspath), 2)])
    print("Result Path:", formatted_path)
    print("Positions:")
    for pos in position:
        print(pos)
    print((gap*1000),"ms")
    save = input("Would you like to save the result (y/n) ?")
    if (save == 'y'):
        save_results_to_file(resultscore,resultspath,position,gap)