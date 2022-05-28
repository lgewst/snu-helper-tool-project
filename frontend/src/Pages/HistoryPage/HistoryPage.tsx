import axios from 'axios';
import { get } from 'lodash';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { Response } from '../../Utils/interface';

interface LocationState {
  func: string;
  path: string;
  version: string;
}

const HistoryPage = () => {
  const location = useLocation<LocationState>();

  const params = new URLSearchParams(location.search);

  console.log(params.toString());

  console.log(params.get('func'));

  const init = () => {
    axios
      .get<Response>(`/functions/${params.get('func')}/later`, {
        params: { path: params.get('path'), later_version: params.get('version') },
      })
      .then((res) => {
        console.log(res.data.later_version);
        res.data;
      })
      .catch((err) => {
        const message = get(err, ['response', 'data', 'message'], '오류가 발생했습니다.');
        toast.error(message);
      });
  };

  useEffect(() => {
    init();
  }, [location.pathname]);

  return <div>hi</div>;
};

export default HistoryPage;
