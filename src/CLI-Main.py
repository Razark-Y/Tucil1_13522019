from config import readfile
print("Cyberpunk 2077 Hacking Minigame Solver")
print("===================================================================================")
print("INSTANT BREACH PROTOCOL SOLVER - START CRACKING, SAMURAI")
while True:
    print("Choose your input type:")
    print("1. Using a txt File.")
    print("2. Input Token and sequence number and let system randomize.")
    choice = input("Select your choices!")
    if choice == '1' or choice == '2':
        break
    print("Please enter either 1 or 2!")
if choice == '1':
    filename = input("Please enter your txt file along with its extension!!")
    buff,mat,seqlist,scorelist = readfile("tes.txt")
else:
    pass
    