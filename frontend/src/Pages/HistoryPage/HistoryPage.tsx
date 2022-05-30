import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { HTMLTooltip } from '../../Components/ConflictInfo/ConflictInfo.style';
import { Response } from '../../Utils/interface';

import {
  CodeWrapper,
  ColorLaterLine,
  ColorTargetLine,
  HistoryHeader,
  LogWrapper,
} from './HistoryPage.style';

interface LocationState {
  func: string;
  path: string;
  version: string;
}

const HistoryPage = () => {
  const location = useLocation<LocationState>();
  const [response, setResponse] = useState<Response>();

  const params = new URLSearchParams(location.search);

  const init = async () => {
    try {
      const response = await axios.get<Response>(`/functions/later`, {
        params: {
          path: params.get('path'),
          later_version: params.get('version'),
          func: params.get('func'),
        },
      });
      setResponse(response.data);
    } catch (err) {
      const message = get(err, ['response', 'data', 'message'], '오류가 발생했습니다.');
      toast.error(message);
    }
  };

  const renderCode = (index: number) => {
    const code = response?.later_version_code?.find((code) => code.index === index);
    return (
      <ColorLaterLine type={code?.type || 'none'}>
        <div className="lineNum">{code?.line || ''}</div>
        <pre>{code?.content}</pre>
      </ColorLaterLine>
    );
  };

  const copyToClipboard = (commit_id: string) => {
    navigator.clipboard.writeText(commit_id);
  };

  useEffect(() => {
    init();
  }, [location.search]);

  if (!response) return <CircularProgress />;

  return (
    <div>
      <HistoryHeader>
        <div>{response?.path} &gt; </div>
        <div>{response?.name}</div>
      </HistoryHeader>
      <HistoryHeader>
        <div>{response?.target_version} &gt; </div>
        <div>{response?.later_version}</div>
      </HistoryHeader>
      <br />
      <div>
        <div>
          {response?.target_version_code?.map((code) => (
            <div key={code.content + code.index}>
              <CodeWrapper>
                <ColorTargetLine type={code.type}>
                  <div className="lineNum">{code.line || ''}</div>
                  <pre>{code.content}</pre>
                </ColorTargetLine>

                {renderCode(code.index)}
              </CodeWrapper>
            </div>
          ))}
        </div>
      </div>

      <LogWrapper>
        {response?.logs?.map((log) => (
          <div className="blame" key={log.commit_id}>
            <div className="commit_id">
              <span onClick={() => copyToClipboard(log.commit_id)}>
                <ContentCopyIcon fontSize="small" padding-right="10px" />
              </span>
              <span className="commit_id_hover">
                <a className="commit_url" href={log.commit_url}>
                  commit_url
                </a>
                <a className="review_url" href={log.review_url}>
                  review_url
                </a>
              </span>
            </div>
            <div className="author_email_box">
              <a className="author_email" href={log.author_url}>
                {log.author_email}
              </a>
            </div>

            <div className="date">{log.date}</div>
            <div className="commit_msg">
              <HTMLTooltip title={log.commit_msg.detail}>
                <div className="commit_msg_release">{log.commit_msg.release}</div>
              </HTMLTooltip>
            </div>
          </div>
        ))}
      </LogWrapper>
    </div>
  );
};

export default HistoryPage;
