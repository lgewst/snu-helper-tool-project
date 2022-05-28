export interface Blame {
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

export interface Response {
  name: string; // function name
  path: string; // file path
  target_version: string;
  later_version: string;
  target_version_code: [
    {
      index: number;
      line: number;
      content: string; // "\n"은 뺌
      type: string; // {"none", "deleted", "no change"} 중 하나
    },
  ];
  later_version_code: [
    {
      index: number;
      line: number;
      content: string; // "\n"은 뺌
      type: string; // {"none", "inserted", "no change"} 중 하나
    },
  ];
  logs: [
    // 최근 것 먼저
    {
      commit_id: string;
      commit_url: string;
      review_url: string;
      author_url: string;
      author_name: string;
      author_email: string;
      date: string; // format XXXX-XX-XX XX:XX:XX (ex. "2021-01-27 01:32:55")
      commit_msg: {
        detail: string;
        release: string;
      };
    },
  ];
}