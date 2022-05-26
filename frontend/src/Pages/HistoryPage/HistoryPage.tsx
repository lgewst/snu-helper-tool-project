interface Props {
  funcName: string;
  path: string;
  later_version: string;
}

const HistoryPage = ({ funcName, path, later_version }: Props) => {
  console.log(funcName, path, later_version);
  return <div>hi</div>;
};

export default HistoryPage;
