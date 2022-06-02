export interface CompareCode {
  name: string; // function name
  path: string; // file path
  left_id: string;
  right_id: string;
  left_code: {
    index: number;
    line: number;
    content: string;
    type: 'none' | 'deleted' | 'no change';
  }[];
  right_code: {
    index: number;
    line: number;
    content: string;
    type: 'none' | 'inserted' | 'no change';
  }[];
}
