import styled from '@emotion/styled';

export const HistoryHeader = styled.div`
  display: flex;
`;

export const CodeWrapper = styled.div`
  display: flex;
  height: 24px;
  line-height: 24px;

  .lineNum {
    position: sticky;
    left: 0;
    width: 30px;
    background-color: #f5f5f9;
  }
  .code_content {
    left: 25px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  pre {
    margin: 0;
  }
`;

export const CodeId = styled.div`
  display: flex;
  justify-content: space-around;
`;
export const LeftCodeId = styled.div`
  background-color: rgb(253, 246, 226);
`;

export const RightCodeId = styled.div`
  background-color: rgb(233, 240, 253);
`;

export const ColorTargetLine = styled.div<{ type: string }>`
  display: flex;
  width: 50%;
  background-color: ${(props) => (props.type === 'deleted' ? '#FF92B1' : '')};
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  ,
`;

export const ColorLaterLine = styled.div<{ type: string }>`
  display: flex;
  width: 50%;
  background-color: ${(props) => (props.type === 'inserted' ? '#82F9B7' : '')};
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const LogWrapper = styled.div`
  padding-top: 50px;
  border-top: groove;
`;

export const CommitMessage = styled.div`
  width: 500px;
  overflow: scroll;
`;
