import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { Blame, RelatedUrl } from '../../Utils/interface';

import { HTMLTooltip } from './ConflictInfo.style';

const renderBlame = (
  id: number,
  line: number,
  blame: Blame[],
  relatedUrls: RelatedUrl[],
  getRelatedCommit: Function,
) => {
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
              onClick={() => getRelatedUrls(id, blameline.line_start, 5)}
            >
              Related commit urls
            </button>
            <div className="related_urls">
              {relatedUrls
                ?.filter((relatedUrl) => Number(relatedUrl.id) === blameline.line_start)[0]
                .commit_urls.map((url, i) => (
                  <a className="related_link" href={url} key={i}>
                    {i + 1}
                  </a>
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

export default renderBlame;
