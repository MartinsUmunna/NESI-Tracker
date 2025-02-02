import React from 'react';

const ResponsiveEl = ({ children }) => {
  return (
    <div className="responsive-container">
      <div className="responsive-container__inner">
        <div className="responsive-container__content">{children}</div>
      </div>
    </div>
  );
};

export default ResponsiveEl;
