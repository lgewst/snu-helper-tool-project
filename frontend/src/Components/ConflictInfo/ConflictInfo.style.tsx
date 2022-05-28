import styled from '@emotion/styled';
import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

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

export const ConflictWrapper = styled.div``;
