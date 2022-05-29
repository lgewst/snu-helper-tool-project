import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CircularProgress } from '@mui/material';

import { HTMLTooltip } from './ConflictInfo.style';
import './ConflictInfo.css';
interface Code {
  line: number;
  content: string;
  function: string;
  mode: number;
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
  commit_msg: {
    detail: string;
    release: string;
  };
}
interface Conflict {
  id: string;
  code: Code[];
}

interface Props {
  conflict: Conflict;
  blame: Blame[];
  relatedUrls: string[];
  getRelatedCommit: Function;
}

const ConflictInfo = ({ conflict, blame, relatedUrls, getRelatedCommit }: Props) => {
  console.log(blame);
  const renderBlame = (line: number) => {
    const blameline = blame.find((bi) => bi.line_start === line);

    if (!blameline) return null;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(blameline.commit_id);
    };

    const getRelatedUrls = (index: number, line_num: number, commit_num: number) => {
      getRelatedCommit(index, line_num, commit_num);
    };

    return (
      <div className="blame" key={blameline.line_start}>
        <div className="commit_id">
          <span onClick={copyToClipboard}>
            <ContentCopyIcon fontSize="small" padding-right="10px" />
          </span>
          <span className="commit_id_hover">
            <a className="commit_url" href={blameline.commit_url}>
              commit_url
            </a>
            <a className="review_url" href={blameline.review_url}>
              review_url
            </a>
            <div className="related_url">
              <button
                className="related_submit"
                onClick={() => getRelatedUrls(Number(conflict.id), blameline.line_start, 5)}
              >
                Related commit urls
              </button>
              <div className="related_urls">
                {relatedUrls?.map((url, i) => (
                  <div key={i}>{url}</div>
                ))}
              </div>
            </div>
          </span>
        </div>
        <div className="author_email_box">
          <a className="author_email" href={blameline.author_url}>
            {blameline.author_email}
          </a>
        </div>

        <div className="date">{blameline.date}</div>
        <div className="commit_msg">
          <HTMLTooltip title={blameline.commit_msg.detail}>
            <div className="commit_msg_release">{blameline.commit_msg.release}</div>
          </HTMLTooltip>
        </div>
      </div>
    );
  };

  const colorFunc = (code: Code) => {
    if (code.function != '') {
      const strColor = code.content.replace(
        code.function,
        (match) => `<span style="color: red">${match}</span>`,
      );
      return <div className="colored_code" dangerouslySetInnerHTML={{ __html: strColor }}></div>;
    } else {
      return code.content;
    }
  };
  return (
    <div key={conflict.id} className="conflict">
      <div className="conflict_codeline">
        {conflict.code.map((code) => (
          <div key={code.line + code.content}>
            {code.line === 0 ? (
              <div className="dots_back">
                <div className="dots">...</div>
              </div>
            ) : (
              <div className="codeline">
                <div className="line">{code.line}</div>
                <div className="code">
                  {code.mode === 1 ? (
                    <pre className="current_code">{colorFunc(code)}</pre>
                  ) : (
                    <pre className="incoming_code">{colorFunc(code)}</pre>
                  )}
                </div>
                {blame.length != 0 ? (
                  <div className="blame">{renderBlame(code.line)}</div>
                ) : (
                  <CircularProgress
                    sx={{ position: 'fixed', left: 'calc(70vw - 30px)', top: 100 }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictInfo;
