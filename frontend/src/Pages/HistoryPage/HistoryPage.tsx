import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { Response } from '../../Utils/interface';

import { CodeWrapper, ColorLaterLine, ColorTargetLine, HistoryHeader } from './HistoryPage.style';

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
      <ColorLaterLine type={code?.type}>
        <div className="lineNum">{code?.line || ''}</div>
        <pre>{code?.content}</pre>
      </ColorLaterLine>
    );
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
    </div>
  );
};

export default HistoryPage;
