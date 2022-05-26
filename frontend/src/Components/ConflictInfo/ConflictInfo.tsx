import { CircularProgress } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useHistory } from 'react-router-dom';

import Blame from '../../Utils/interface';

import './ConflictInfo.css';
import renderBlame from './renderBlame';

interface Code {
  line: number;
  content: string;
  function: string;
}
interface Conflict {
  id: string;
  code: Code[];
}

interface Props {
  conflict: Conflict;
  blame: Blame[];
}

const ConflictInfo = ({ conflict, blame }: Props) => {
  const history = useHistory();

  const onClickFunction = (funcName: string) => {
    history.push({
      pathname: '/func',
      state: { funcName: funcName },
    });
  };

  const colorFunc = (code: Code) => {
    if (code.function != '') {
      const strColor = code.content.replace(
        code.function,
        (match) => `<span style="color: red">${match}</span>`,
      );
      return (
        <div
          className="colored_code"
          onClick={() => onClickFunction(code.function)}
          dangerouslySetInnerHTML={{ __html: strColor }}
        ></div>
      );
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
                <pre className="code">{colorFunc(code)}</pre>
                {blame.length != 0 ? (
                  <div className="blame">{renderBlame(code.line, blame)}</div>
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
