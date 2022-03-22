class Line():
    def __init__(self, rev, author_name, date, line_num, content):
        self.rev = rev
        self.author_name = author_name
        self.date = date
        self.line_num = line_num
        self.content = content
    
    def __repr__(self):
        return f"{self.rev:44}({self.author_name:20}{self.date:20}{self.line_num:>6s}){self.content}\n"
