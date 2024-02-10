def path_printer(path, positions):
    path_str = " ".join(str(x) for x in path)
    positions_str = " -> ".join(f"({x},{y})" for x, y in positions)
    print(f"Path: {path_str}")
    print(f"Positions: {positions_str}\n")

def pathToWord(path):
    return "".join(str(x) for x in path)