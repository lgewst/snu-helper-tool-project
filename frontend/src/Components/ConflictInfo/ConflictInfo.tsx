import React from 'react';
import './ConflictInfo.css';

interface Code {
  line: number;
  content: string;
}
interface Blame {
  commit_id: string;
  commit_url: string;
  review_url: string;
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
  conflict: Conflict;
}

const styles = {
  odd_color: { backgroundColor: 'white' } as React.CSSProperties,
  even_color: { backgroundColor: 'white' } as React.CSSProperties,
  out_color: {} as React.CSSProperties,
};

const ConflictInfo = ({ conflict }: Props) => {
  let i = 0;
  let in_blame = false;
  const blame = conflict.blame.map((blame) => (
    <div className="blame" key={blame.line_start}>
      <div className="commit_id">#</div>
      <div className="commit_id_hover">
        <div className="commit_id_text">{blame.commit_id}</div>
        <a className="commit_url" href={blame.commit_url}>
          commit_url
        </a>
        <a className="review_url" href={blame.review_url}>
          review_url
        </a>
      </div>
      <div>
        {blame.author_email.includes('lge') ? (
          <a
            className="author_email"
            href={`https://github.com/webosose/chromium91/commits?author=${
              blame.author_name.split(' ')[0]
            }`}
          >
            {blame.author_email}
          </a>
        ) : (
          <a
            className="author_email"
            href={`https://chromium-review.googlesource.com/q/owner:${blame.author_email}`}
          >
            {blame.author_email}
          </a>
        )}
      </div>

      <div className="date">{blame.date}</div>
    </div>
  ));

  return (
    <div key={conflict.id} className="conflict">
      <div className="conflict_codeline">
        {conflict.code.map((code) => (
          <div
            className="codeline"
            key={code.line}
            style={
              in_blame
                ? i % 2 === 0
                  ? styles.odd_color
                  : styles.even_color
                : styles.out_color
            }
          >
            <div className="line">{code.line}</div>
            <div className="code">{code.content}</div>
            <div className="blame">
              {in_blame && i !== conflict.blame.length
                ? code.line === conflict.blame[i].line_end
                  ? ((in_blame = false), i++)
                  : null
                : code.line === conflict.blame[i].line_start
                ? (in_blame = true)
                : null}
              {code.line === conflict.blame[i].line_start ? blame[i] : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictInfo;
