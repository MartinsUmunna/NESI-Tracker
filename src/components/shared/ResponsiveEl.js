import React from 'react';

const ResponsiveEl = ({ children }) => {
  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ width: '900px' }}>{children}</div>
    </div>
  );
};

export default ResponsiveEl;
