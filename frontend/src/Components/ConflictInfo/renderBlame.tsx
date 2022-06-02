import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';

import { Blame, RelatedUrl, RelatedPressed } from '../../Utils/interface';

import { HTMLTooltip } from './ConflictInfo.style';

const renderBlame = (
  id: number,
  line: number,
  blame: Blame[],
  relatedUrls: RelatedUrl[],
  getRelatedCommit: Function,
) => {
  const blameline = blame.find((bi) => bi.line_start === line);
  const [pressed, setPressed] = useState<RelatedPressed[]>();

  if (!blameline) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(blameline.commit_id);
  };

  const getRelatedUrls = (index: number, line_num: number, commit_num: number) => {
    const newpressed: RelatedPressed = {
      id: index.toString(),
      pressed: true,
    };
    if (pressed === undefined) {
      console.log('hello');
      setPressed([newpressed]);
    } else {
      setPressed(pressed.concat([newpressed]));
    }
    console.log(newpressed);
    console.log([newpressed]);
    console.log(pressed?.concat([newpressed]));
    console.log(pressed);
    getRelatedCommit(index, line_num, commit_num);
  };

  // console.log(relatedUrls?.filter((relatedUrl) => Number(relatedUrl.id) === 86)[0] === undefined);
  // console.log(pressed?.filter((press) => Number(press.id) === 86)[0]?.pressed);
  // console.log(pressed);

  return (
    <div className="blame" key={blameline.line_start}>
      <div className="commit_id">
        <span onClick={copyToClipboard}>
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
              onClick={() => getRelatedUrls(id, blameline.line_start, 5)}
            >
              Related commit urls
            </button>
            {pressed?.filter((press) => Number(press.id) === blameline.line_start)[0]?.pressed &&
            relatedUrls?.filter(
              (relatedUrl) => Number(relatedUrl.id) === blameline.line_start,
            )[0] === undefined ? (
              <div className="circular">
                <CircularProgress />
              </div>
            ) : (
              <div className="related_urls">
                {relatedUrls
                  ?.filter((relatedUrl) => Number(relatedUrl.id) === blameline.line_start)[0]
                  ?.commit_urls.map((url, i) => (
                    <a className="related_link" href={url} key={i}>
                      {i + 1}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </span>
      </div>
      <div className="author_email_box">
        <a className="author_email" href={blameline.author_url} target="_blank">
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
