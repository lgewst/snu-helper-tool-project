import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { Blame } from '../../Utils/interface';

import { HTMLTooltip } from './ConflictInfo.style';

const renderBlame = (line: number, blame: Blame[]) => {
  const blameline = blame.find((bi) => bi.line_start === line);

  if (!blameline) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blameline.commit_id);
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

export default renderBlame;
