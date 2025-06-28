"use client";

import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const InfoTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#242424',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#242424',
    color: '#f0f0f0',
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #333',
    padding: theme.spacing(1.5),
  },
}));

export default InfoTooltip;