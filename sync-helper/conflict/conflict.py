class Conflict():
    def __init__(self, repo_path, file_path, current_line, incoming_line):
        self.repo_path = repo_path
        self.file_path = file_path
        self.current_line = current_line
        self.incoming_line = incoming_line

    def __init__(self, repo_path, file_path, l1, l2, l3):
        self.repo_path = repo_path
        self.file_path = file_path
        self.current_line = (l1 + 1, l2 - 1)
        self.incoming_line = (l2 + 1, l3 - 1)
    
    def __repr__(self):
        return f"{self.file_path:100}{str(self.current_line):15}{str(self.incoming_line)}"

conflicts = []
