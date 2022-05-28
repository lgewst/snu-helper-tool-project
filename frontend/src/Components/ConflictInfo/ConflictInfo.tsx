import { Button, CircularProgress, Fade, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { ChangeEvent, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Blame } from '../../Utils/interface';

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
  const [func, setfunc] = useState('');
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState('');
  const location = useLocation();

  const path = location.pathname.slice(6);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setVersion(value);
  };

  const onClickFunction = (funcName: string) => {
    setOpen(true);
    setfunc(funcName);
  };

  const onClickSubmit = () => {
    const params = new URLSearchParams();
    params.set('path', path);
    params.set('func', func);
    params.set('version', version);

    history.push({
      pathname: '/func/',
      search: `${params}`,
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
        />
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Fade in={open}>
          <div>
            <TextField type="text" onChange={onChange} placeholder="ex)94.0.4606.0" />
            <Button
              className="button"
              type="submit"
              onClick={() => {
                onClickSubmit();
              }}
            >
              submit
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ConflictInfo;
