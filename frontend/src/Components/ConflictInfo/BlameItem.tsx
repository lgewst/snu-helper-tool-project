import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

import { Blame, RelatedUrl } from '../../Utils/interface';

import { HTMLTooltip } from './ConflictInfo.style';
interface RelatedAuthorCommit {
  commit_id: string;
  author_email: string;
  commits: {
    index: number; // 1부터 시작, 관련도가 높은 것 먼저
    id: string; // related commit id
    commit_url: string; // related commit url
    relevance: number; // 관련도 0 ~ 1.0 사이의 값
  }[];
}

const BlameItem = ({
  id,
  line,
  blame,
  getAuthorRel,
  getRelatedCommit,
  relAuthCommit,
  relatedUrls,
}: {
  id: number;
  line: number;
  blame: Blame[];
  relatedUrls: RelatedUrl[];
  getRelatedCommit: Function;
  relAuthCommit: RelatedAuthorCommit[];
  getAuthorRel: Function;
}) => {
  const [commit, setCommit] = useState<RelatedAuthorCommit>();

  const blameline = blame.find((bi) => bi.line_start === line);

  if (!blameline) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blameline.commit_id);
  };

  const hoverAuthor = () => {
    const findcommit = relAuthCommit?.find((commit) => blameline.commit_id === commit.commit_id);
    if (!findcommit) {
      getAuthorRel(blameline.commit_id, blameline.author_email);
    } else {
      setCommit(findcommit);
    }
  };

  console.log(commit?.commits);

  return (
    <div className="blame" key={blameline.line_start}>
      <div className="commit_id">
        <span onClick={() => copyToClipboard}>
          <ContentCopyIcon fontSize="small" padding-right="10px" />
        </span>
        <span className="commit_id_hover">
          <a className="commit_url" href={blameline.commit_url} target="_blank">
            commit_url
          </a>
          <a className="review_url" href={blameline.review_url} target="_blank">
            review_url
          </a>
          <div className="related_url">
            <button
              className="related_submit"
              onClick={() => getRelatedCommit(id, blameline.line_start, 5)}
            >
              Related commit urls
            </button>
            <div className="related_urls">
              {relatedUrls
                ?.filter((relatedUrl) => Number(relatedUrl.id) === blameline.line_start)[0]
                ?.commit_urls.map((url, i) => {
                  if (url === 'None') {
                    return <a className="related_link">No related commit</a>;
                  } else {
                    return (
                      <a className="related_link" href={url} key={i}>
                        {i + 1}
                      </a>
                    );
                  }
                })}
            </div>
          </div>
        </span>
      </div>
      <div className="author_email_box">
        <HTMLTooltip
          onMouseEnter={() => {
            hoverAuthor();
          }}
          title={
            <div>
              {commit ? (
                commit.commits.length === 0 ? (
                  'No related commits'
                ) : (
                  <>
                    {commit.commits.map((commit) => (
                      <a
                        href={commit.commit_url}
                        target="_blank"
                        key={commit.commit_url}
                        style={{ textDecoration: 'none' }}
                      >
                        {commit.index + ' '}
                      </a>
                    ))}
                  </>
                )
              ) : (
                'Loading'
              )}
            </div>
          }
        >
          <a className="author_email" href={blameline.author_url} target="_blank">
            {blameline.author_email}
          </a>
        </HTMLTooltip>
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

export default BlameItem;
