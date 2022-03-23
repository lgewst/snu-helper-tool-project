class Blame():
    def __init__(self, repo_path, file_path, current_lines, incoming_lines):
        self.repo_path = repo_path
        self.file_path = file_path
        self.current_lines = current_lines
        self.incoming_lines = incoming_lines

    def __repr__(self):
        message = self.file_path + "\n[current]\n"
        for line in self.current_lines:
            message += repr(line)
        message += "\n[incoming]\n"
        for line in self.incoming_lines:
            message += repr(line)
        return message + '\n\n'

blames = []
