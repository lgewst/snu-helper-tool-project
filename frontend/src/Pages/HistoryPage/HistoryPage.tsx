import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useHistory } from 'react-router-dom';

import { HTMLTooltip } from '../../Components/ConflictInfo/ConflictInfo.style';
import { Response } from '../../Utils/interface';

import {
  CodeId,
  CodeWrapper,
  ColorLaterLine,
  ColorTargetLine,
  CommitMessage,
  HistoryHeader,
  LeftCodeId,
  LogWrapper,
  RightCodeId,
} from './HistoryPage.style';
import { CompareCode } from './interface';

interface LocationState {
  func: string;
  path: string;
  version: string;
}

const HistoryPage = () => {
  const location = useLocation<LocationState>();
  const [response, setResponse] = useState<Response>();
  const [compCode, setCompCode] = useState<CompareCode>();
  const [selectedLeft, setSelectedLeft] = useState('');
  const [selectedRight, setSelectedRight] = useState('');
  const params = new URLSearchParams(location.search);
  const history = useHistory();
  const path = params.get('path');

  const [leftCommitId, setLeftCommitId] = useState('');
  const [rightCommitId, setRightCommitId] = useState('');

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
      setLeftCommitId(response.data.logs[0].commit_id);
      setRightCommitId(response.data.logs.at(-1)!.commit_id);
    } catch (err) {
      const message = get(err, ['response', 'data', 'message'], '오류가 발생했습니다.');
      toast.error(message);
    }
  };

  const renderCode = (index: number) => {
    const code = compCode?.right_code?.find((code) => code.index === index);
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

  const getCompCommit = async () => {
    try {
      const response = await axios.get<CompareCode>(`/functions/diff`, {
        params: {
          path: params.get('path'),
          func: params.get('func'),
          left_id: leftCommitId,
          right_id: rightCommitId,
        },
      });
      setCompCode(response.data);
    } catch (err) {
      const message = get(err, ['response', 'data', 'message'], '오류가 발생했습니다.');
      toast.error(message);
    }
  };

  const getLeftCommit = async (commit_id: string) => {
    console.log('left');
    setLeftCommitId(commit_id);
    setSelectedLeft(commit_id);
  };
  const getRightCommit = (commit_id: string) => {
    setRightCommitId(commit_id);
    setSelectedRight(commit_id);
  };

  useEffect(() => {
    init();
  }, [location.search]);

  useEffect(() => {
    if (rightCommitId && leftCommitId) getCompCommit();
  }, [rightCommitId, leftCommitId]);

  if (!response) {
    return (
      <div>
        <CircularProgress />
        <br />
        <Button onClick={() => history.push(`/file/${path}`)} variant="outlined">
          return
        </Button>
      </div>
    );
  }

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
          <CodeId>
            <LeftCodeId>{compCode?.left_id}</LeftCodeId>
            <RightCodeId>{compCode?.right_id}</RightCodeId>
          </CodeId>
          <br />

          {compCode?.left_code?.map((code) => (
            <div key={compCode?.left_id + code.content + code.index}>
              <CodeWrapper>
                <ColorTargetLine type={code.type}>
                  <div className="lineNum">{code.line || ''}</div>
                  <pre className="code_content">{code.content}</pre>
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
              <div onClick={() => copyToClipboard(log.commit_id)}>
                <ContentCopyIcon fontSize="small" padding-right="10px" />
              </div>
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
            <CommitMessage>
              {log.commit_msg.detail ? (
                <HTMLTooltip title={log.commit_msg.detail}>
                  <div className="commit_msg_release">{log.commit_msg.release}</div>
                </HTMLTooltip>
              ) : null}
            </CommitMessage>

            <div>
              <Button
                onClick={() => getLeftCommit(log.commit_id)}
                variant={log.commit_id === selectedLeft ? 'contained' : 'text'}
                size="small"
              >
                left
              </Button>
              <Button
                onClick={() => getRightCommit(log.commit_id)}
                variant={log.commit_id === selectedRight ? 'contained' : 'text'}
                size="small"
              >
                right
              </Button>
            </div>
          </div>
        ))}
        {response?.logs.length ? '' : 'No change in this function'}
      </LogWrapper>

      <Button onClick={() => history.push(`/file/${path}`)} variant="outlined">
        return
      </Button>
    </div>
  );
};

export default HistoryPage;
