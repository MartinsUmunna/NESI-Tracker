import React from 'react';
import { Box } from '@mui/material';

const ResponsiveEl = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        '& > div': {
          minWidth: '100%',
          width: '800px',
        },
      }}
    >
      <div>{children}</div>
    </Box>
  );
};

export default ResponsiveEl;
