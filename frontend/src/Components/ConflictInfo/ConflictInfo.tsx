import './ConflictInfo.css';
interface Code {
  line: number;
  content: string;
  function: string;
}
interface Blame {
  commit_id: string;
  commit_url: string;
  review_url: string;
  author_url: string;
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

const ConflictInfo = ({ conflict }: Props) => {
  const renderBlame = (line: number) => {
    const blame = conflict.blame.find((bi) => bi.line_start === line);

    if (!blame) return null;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(blame.commit_id);
    };

    return (
      <div className="blame" key={blame.line_start}>
        <div className="commit_id">
          <span onClick={copyToClipboard}>#</span>
          <span className="commit_id_hover">
            <div className="commit_id_text">{blame.commit_id}</div>
            <a className="commit_url" href={blame.commit_url}>
              commit_url
            </a>
            <a className="review_url" href={blame.review_url}>
              review_url
            </a>
          </span>
        </div>
        <div className="author_email_box">
          <a className="author_email" href={blame.author_url}>
            {blame.author_email}
          </a>
        </div>

        <div className="date">{blame.date}</div>
      </div>
    );
  };

  const colorFunc = (code: Code) => {
    const strColor = code.content.replace(
      code.function,
      (match) => `<span style="color: red"> ${match} </span>`,
    );
    return (
      <div
        className="colored_code"
        dangerouslySetInnerHTML={{ __html: strColor }}
      ></div>
    );
  };
  return (
    <div key={conflict.id} className="conflict">
      <div className="conflict_codeline">
        {conflict.code.map((code) => (
          <div className="codeline" key={code.line}>
            <div className="line">{code.line}</div>
            <pre className="code">{colorFunc(code)}</pre>
            <div className="blame">{renderBlame(code.line)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictInfo;
