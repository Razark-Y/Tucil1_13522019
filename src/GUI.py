import tkinter as tk
from tkinter.font import Font
import customtkinter
class MatrixApp:
    def __init__(self, master):
        self.master = master
        master.title("Matrix Input")
        master.state('zoomed')  
        self.rows = tk.IntVar(value=1)
        self.cols = tk.IntVar(value=1)
        self.setup_widgets()
        padding_frame = tk.Frame(self.master, padx=100, pady=20)
        padding_frame.pack(side="left", fill="both", expand=True)
        self.matrix_frame = tk.Frame(padding_frame)
        self.matrix_frame.pack(fill="both", expand=True)
        self.matrix_frame.pack(side="left", fill="both", expand=True)

    def setup_widgets(self):
        control_frame = tk.Frame(self.master)
        control_frame.pack(side="top", fill="x")

        tk.Label(control_frame, text="Rows:").pack(side="left")
        tk.Entry(control_frame, textvariable=self.rows).pack(side="left")

        tk.Label(control_frame, text="Columns:").pack(side="left")
        tk.Entry(control_frame, textvariable=self.cols).pack(side="left")

        tk.Button(control_frame, text="Create", command=self.create_matrix).pack(side="left")

    def create_matrix(self):
        for widget in self.matrix_frame.winfo_children():
            widget.destroy()

        rows = self.rows.get()
        cols = self.cols.get()

        self.matrix_entries = []

        for r in range(rows):
            row_entries = []
            for c in range(cols):
                text_widget = customtkinter.CTkTextbox(master=self.matrix_frame, width=60, height=45,  
                                      wrap='none', border_width=2,font=('Helvetia',22))
                text_widget.grid(row=r, column=c, padx=5, pady=5)
                row_entries.append(text_widget)
            self.matrix_entries.append(row_entries)

def main():
    root = tk.Tk()
    app = MatrixApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
