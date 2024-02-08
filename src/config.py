def readfile(file_path):
    matrixInput = False
    count = 0
    Matrix = []
    with open(file_path, 'r') as file:
        lines = file.readlines()
        buffer_size = int(lines[0].strip())
        matrix_width = int((lines[0].strip().split())[0])
        matrix_height = int((lines[1].strip().split())[0])
        for i in range(2,2+matrix_height):
            rows = lines[i].strip().split()
            if (len(rows) == matrix_width-1):
                Matrix.append(rows)
            else:
                print("error in reading file")
                return 0,[]
    return buffer_size,Matrix
# readfile("tes.txt")
buff,mat = readfile("tes.txt")
print("buff=",buff)
print("mat",mat)