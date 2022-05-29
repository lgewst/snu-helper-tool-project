import styled from '@emotion/styled';

export const HistoryHeader = styled.div`
  display: flex;
`;

export const CodeWrapper = styled.div`
  display: flex;
  height: 24px;
  line-height: 24px;

  .lineNum {
    width: 25px;
    background-color: #f5f5f9;
  }

  pre {
    margin: 0;
  }
`;

export const ColorTargetLine = styled.div<{ type: string }>`
  display: flex;
  width: 50%;
  background-color: ${(props) => (props.type === 'inserted' ? '#FF92B1' : '')};
`;

export const ColorLaterLine = styled.div<{ type: string }>`
  display: flex;
  width: 50%;
  background-color: ${(props) => (props.type === 'inserted' ? '#82F9B7' : '')};
`;
