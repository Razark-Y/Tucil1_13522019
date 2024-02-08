import time

resultscore = 0  # Global variable to keep track of the highest score
resultspath = ""
def path_printer(path, positions):
    path_str = " ".join(str(x) for x in path)
    positions_str = " -> ".join(f"({x},{y})" for x, y in positions)
    print(f"Path: {path_str}")
    print(f"Positions: {positions_str}\n")

def pathToWord(path):
    return "".join(str(x) for x in path)

def find_seq(matrix, start_x, start_y, movement, sequence, score):
    global resultscore  # Declare that we're using the global variable
    global resultspath
    stack = [(start_x, start_y, movement, [matrix[start_x][start_y]], [(start_x, start_y)])]

    while stack:
        current_x, current_y, current_movement, path, positions = stack.pop()

        if len(path) == 7 and len(path):
            path_str = pathToWord(path)
            # print(path_str)
            # if (path_str == "55BDE91CBD557A"):
            #     print("exist")
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
                    print("hello")
                    resultscore = totalscore
                    resultspath = path_str
                if totalscore == resultscore:
                    if len(pathToWord(resultspath)) > len(path_str[:FinalEndpoint + 1]):
                        print("start path:",resultspath)
                        print("Trrimmed path",path_str[:FinalEndpoint + 1])
                        print("Tes")
                        resultspath = path_str[:FinalEndpoint+1]
                        print("endresultpath:",resultspath)
                    
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

start = time.time()

matrix = [['7A', '55', 'E9', 'E9', '1C', '55'],
 ['55', '7A', '1C', '7A', 'E9', '55'],
 ['55', '1C', '1C', '55', 'E9', 'BD'],
 ['BD', '1C', '7A', '1C', '55', 'BD'],
 ['BD', '55', 'BD', '7A', '1C', '1C'],
 ['1C', '55', '55', '7A', '55', '7A']]
sequence = ["BD1C55","BDE91CE9","BD7ABD"]
score = [50,10,1]
for x in range(6):
    find_seq(matrix, 0, x, "vertical",sequence,score)

print(resultscore)
print(resultspath)
end = time.time()
print(f"Execution Time: {end - start} seconds")