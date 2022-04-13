import React from 'react';
import './ConflictInfo.css';

interface Code {
  line: number;
  content: string;
}
interface Blame {
  commit_id: string;
  line_start: number;
  line_end: number;
  author_name: string;
  author_email: string;
  date: string;
}
interface Conflict {
  id: string;
  code: Code[];
  blame: Blame[];
}

interface Props {
  conflictList: Conflict[];
}

const ConflictInfo = ({ conflictList }: Props) => {
  console.log(conflictList);

  return (
    <div>
      {conflictList.map((conflict) => (
        <div key={conflict.id} className="conflict">
          <div className="conflict_codeline">
            {conflict.code.map((code) => (
              <div className="codeline" key={code.line}>
                <div className="line">{code.line}</div>
                <div className="code">{code.content}</div>
              </div>
            ))}
          </div>
          <div className="conflict_blame">
            {conflict.blame.map((blame) => (
              <div>
                {blame.author_name === 'Not Committed Yet'
                  ? 'X'
                  : blame.author_name}
                {blame.commit_id}
                {blame.date}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConflictInfo;
