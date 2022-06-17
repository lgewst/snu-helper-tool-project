import { CircularProgress } from '@mui/material';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Blame, RelatedUrl } from '../../Utils/interface';

import './ConflictInfo.css';
import { VersionInput, VersionInputModalContent, VersionSubmitButton } from './ConflictInfo.style';
import renderBlame from './renderBlame';

interface Code {
  line: number;
  content: string;
  function: string;
  mode: number;
}
interface Conflict {
  id: string;
  code: Code[];
}

interface Props {
  conflict: Conflict;
  blame: Blame[];
  relatedUrls: RelatedUrl[];
  getRelatedCommit: Function;
}

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

const ConflictInfo = ({ conflict, blame, relatedUrls, getRelatedCommit }: Props) => {
  const history = useHistory();
  const [func, setfunc] = useState('');
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState('');
  const [relAuthCommit, setRelAuthCommit] = useState<RelatedAuthorCommit[]>();
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

  const getRelatedUrls = (index: number, line_num: number, commit_num: number) => {
    getRelatedCommit(index, line_num, commit_num);
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

  const getAuthorRel = (commit_id: string, author_email: string) => {
    axios.get('/author/related/', { params: { commit_id, author_email } }).then((res) => {
      if (relAuthCommit === undefined) {
        setRelAuthCommit([res.data]);
      } else {
        setRelAuthCommit([...relAuthCommit, res.data]);
      }
    });
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
                  {code.mode === 3 ? (
                    <pre className="normal_code">{colorFunc(code)}</pre>
                  ) : (
                    <span className="color_back">
                      {code.mode === 1 ? (
                        <pre className="current_code">{colorFunc(code)}</pre>
                      ) : (
                        <pre className="incoming_code">{colorFunc(code)}</pre>
                      )}
                    </span>
                  )}
                </div>
                {blame.length != 0 ? (
                  <div className="blame">
                    {renderBlame(
                      Number(conflict.id),
                      code.line,
                      blame,
                      relatedUrls,
                      getRelatedUrls,
                      relAuthCommit!,
                      getAuthorRel,
                    )}
                  </div>
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
        <VersionInputModalContent
          onSubmit={(e) => {
            e.preventDefault();
            onClickSubmit();
          }}
        >
          <VersionInput
            label="version"
            name="version"
            value={version}
            onChange={onChange}
            placeholder="ex) 94.0.4606.0"
          />
          <VersionSubmitButton type="submit" variant="contained">
            submit
          </VersionSubmitButton>
        </VersionInputModalContent>
      </Modal>
    </div>
  );
};

export default ConflictInfo;
