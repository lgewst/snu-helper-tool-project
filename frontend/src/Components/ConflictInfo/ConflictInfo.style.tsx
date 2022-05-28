import styled from '@emotion/styled';
import { Button, TextField, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const HTMLTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    fontSize: 16,
    lineHeight: 1.5,
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid #dadde9',
  },
}));

export const VersionInputModalContent = styled.form`
  background-color: white;
  position: fixed;
  width: 400px;
  padding: 30px;
  left: calc(50vw - 150px);
  top: calc(50vh - 150px);
  box-sizing: border-box;
  border-radius: 16px;
  text-align: right;
`;

export const VersionInput = styled(TextField)`
  width: 100%;
  margin-bottom: 16px;
`;

export const VersionSubmitButton = styled(Button)``;
