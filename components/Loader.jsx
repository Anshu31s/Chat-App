import React from 'react';

const Loader = () => {
  const loaderStyle = {
    width: '90vw',
  };

  const wrapperStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const spanStyle = {
    height: '7px',
    width: '7px',
    backgroundColor: 'rgba(160, 160, 160)',
    display: 'inline-block',
    position: 'relative',
    margin: '0px 2px',
    borderRadius: '100%',
    opacity: 0,
    animation: 'loading 3000ms ease-in-out infinite',
  };

  const span1Style = { ...spanStyle, animationDelay: '250ms' };
  const span2Style = { ...spanStyle, animationDelay: '200ms' };
  const span3Style = { ...spanStyle, animationDelay: '150ms' };
  const span4Style = { ...spanStyle, animationDelay: '100ms' };
  const span5Style = { ...spanStyle, animationDelay: '50ms' };

  return (
    <div style={loaderStyle}>
      <div style={wrapperStyle}>
        <span style={span1Style}></span>
        <span style={span2Style}></span>
        <span style={span3Style}></span>
        <span style={span4Style}></span>
        <span style={span5Style}></span>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-350px);
            opacity: 0;
          }
          35%, 65% {
            transform: translateX(0px);
            opacity: 1;
          }
          100% {
            transform: translateX(350px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;