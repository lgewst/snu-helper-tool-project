import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import ConflictInfo from '../../Components/ConflictInfo/ConflictInfo';
import PathInfo from '../../Components/PathInfo/PathInfo';
import { useInitContext } from '../../Contexts/initContext';

import './Filepage.css';

interface Code {
  line: number;
  content: string;
  function: string;
  mode: number;
}
interface Blame {
  commit_id: string;
  commit_url: string;
  review_url: string;
  author_url: string;
  line_start: number;
  line_end: number;
  author_name: string;
  author_email: string;
  date: string;
  commit_msg: {
    detail: string;
    release: string;
  };
}
interface Conflict {
  id: string;
  code: Code[];
}

interface BlameConflict {
  id: string;
  blame: Blame[];
}

interface RelatedUrl {
  id: string;
  commit_urls: string[];
}

const FilePage = () => {
  const { reinitialize } = useInitContext();
  const [conflictList, setConflictList] = useState<Conflict[]>();
  const [blameList, setBlameList] = useState<BlameConflict[]>();
  const [relatedUrls, setRelatedUrls] = useState<RelatedUrl[]>();
  const location = useLocation();

  const init = () => {
    const path = location.pathname.slice(6);

    axios
      .get<{ conflicts: Conflict[] }>('/chromium/file/', { params: { path: path } })
      .then((res) => setConflictList(res.data.conflicts))
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          reinitialize();
        }
        if (err.response.data.error_code === 10004) {
          toast.error('invalid path');
        }
      });

    axios
      .get<{ conflicts: BlameConflict[] }>('/chromium/blame/', { params: { path: path } })
      .then((res) => setBlameList(res.data.conflicts))
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          reinitialize();
        }
        if (err.response.data.error_code === 10004) {
          toast.error('invalid path');
        }
      });
  };

  useEffect(() => {
    init();
  }, []);

  const renderBlame = (index: number) => {
    return blameList ? blameList[index].blame : [];
  };

  const getRelatedCommit = (index: number, line_num: number, commit_num: number) => {
    axios
      .get('/chromium/conflicts/' + index + '/related/', {
        params: { line_num: line_num, commit_num: commit_num },
      })
      .then((res) => {
        if (relatedUrls === undefined) {
          setRelatedUrls(res.data.response);
        } else {
          setRelatedUrls(relatedUrls.concat(res.data.response[0]));
        }
      })
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          reinitialize();
        }
        if (err.response.data.error_code === 10004) {
          toast.error('invalid path');
        }
      });
  };

  return (
    <div className="wrapper">
      <div className="filepage">
        <div className="header">
          <div className="header line">Line</div>
          <div className="header code">Code</div>
          <div className="header id"> </div>
          <div className="header author">author_email</div>
          <div className="header date">commit_date</div>
          <div className="header msg"> commit_msg</div>
        </div>
        {conflictList?.map((conflict, i) => (
          <ConflictInfo
            conflict={conflict}
            blame={renderBlame(i)}
            key={conflict.id}
            relatedUrls={relatedUrls!}
            getRelatedCommit={getRelatedCommit}
          />
        )) ?? <CircularProgress sx={{ position: 'fixed', left: 'calc(50vw - 30px)', top: 100 }} />}
      </div>
      <PathInfo />
    </div>
  );
};

export default FilePage;
