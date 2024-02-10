import time
from helper import pathToWord
from helper import path_printer
def find_seq(buffer,matrix, start_x, start_y, movement, sequence, score):
    resultscore = 0
    resultspath = ''  
    savedposition = [0]
    length = len(matrix[0])
    for x in range(length):
        stack = [(start_x, x, movement, [matrix[start_x][x]], [(start_x, x)])]
        while stack:
            current_x, current_y, current_movement, path, positions = stack.pop()
            if len(path) == buffer and len(path):
                path_str = pathToWord(path)
                totalscore = 0  # Reset totalscore for each path
                endpoint = -1
                FinalEndpoint = -1
                for count, datamine in enumerate(sequence):  # Use enumerate for proper indexing
                    initialscore = score[count]
                    pos = path_str.find(datamine)   
                    if pos != -1:
                        totalscore += initialscore
                        endpoint = pos + len(datamine) - 1
                        if (endpoint > FinalEndpoint):
                            FinalEndpoint = endpoint
                    if totalscore > resultscore:
                        resultscore = totalscore
                        resultspath = path_str
                        savedposition = positions
                    if totalscore == resultscore:
                        if len(pathToWord(resultspath)) > len(path_str[:FinalEndpoint + 1]):
                            resultspath = path_str[:FinalEndpoint+1]
                            coordinatecut = (FinalEndpoint+1)/2
                            savedposition = positions[:int(coordinatecut)]
                        
            else:
                next_movements = range(len(matrix)) if current_movement == "vertical" else range(len(matrix[0]))
                for next_pos in next_movements:
                    new_x, new_y = (next_pos, current_y) if current_movement == "vertical" else (current_x, next_pos)
                    if (new_x, new_y) not in positions:  # Ensure we don't revisit the same cell in this path
                        new_path = path.copy()
                        new_positions = positions.copy()
                        new_path.append(matrix[new_x][new_y])
                        new_positions.append((new_x, new_y))
                        next_movement = "horizontal" if current_movement == "vertical" else "vertical"
                        stack.append((new_x, new_y, next_movement, new_path, new_positions))
    return resultspath,resultscore,savedposition

# def BruteForceAlgorithm(matrix,buffer,sequence,score):
#     width=len(matrix[0])
#     for x in range(width):
#         resultspath,resultscore,savedposition=find_seq(buffer,matrix, 0, x, "vertical",sequence,score)
#     return resultspath,resultscore,savedposition
# start = time.time()

# matrix = [['7A', '55', 'E9', 'E9', '1C', '55'],
#  ['55', '7A', '1C', '7A', 'E9', '55'],
#  ['55', '1C', '1C', '55', 'E9', 'BD'],
#  ['BD', '1C', '7A', '1C', '55', 'BD'],
#  ['BD', '55', 'BD', '7A', '1C', '1C'],
#  ['1C', '55', '55', '7A', '55', '7A']]
# sequence = ["BD1C55","BDE91CE9","BD7ABD"]
# score = [50,10,1]
# for x in range(6):
#     find_seq(matrix, 0, x, "vertical",sequence,score)

# print(resultscore)
# print(resultspath)
# end = time.time()
# print(f"Execution Time: {end - start} seconds")