import React, { useEffect, useState } from 'react';
const PageLoading = ({ title }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="modern-coming-soon">
      <div className="gradient-bg">
        <div className="gradient-circle c1"></div>
        <div className="gradient-circle c2"></div>
        <div className="gradient-circle c3"></div>
      </div>

      <div className={`content-wrapper ${isVisible ? 'visible' : ''}`}>
        <div className="glass-card">
          <div className="status-badge">{title}</div>

          <h1 className="title">
            Something
            <span className="gradient-text"> Amazing </span>
            is Coming
          </h1>

          <p className="description">
            Our team is working hard to bring you an exceptional experience. We're crafting
            something special and can't wait to share it with you.
          </p>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-liquid"></div>
            </div>
            <span className="progress-text">Development in Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
