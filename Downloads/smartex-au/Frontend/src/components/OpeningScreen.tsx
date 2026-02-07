import React, { useEffect } from 'react';

const OpeningScreen = ({ onFadeComplete }: any) => {
  useEffect(() => {
    const timer = setTimeout(onFadeComplete, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#fff' }}>
      <h1 style={{ fontSize: '64px', fontWeight: '900', letterSpacing: '-2px', position: 'relative' }}>
        Smartex 
        <span style={{ position: 'relative', color: '#2563eb', marginLeft: '10px' }}>
          {/* Graduation Cap SVG */}
          <svg 
            style={{ position: 'absolute', top: '-25px', right: '-20px', transform: 'rotate(15deg)' }} 
            width="45" height="45" viewBox="0 0 24 24" fill="#fff"
          >
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21.18L19 17.18V13.18L12 17.18L5 13.18Z" />
          </svg>
          AU
        </span>
      </h1>
      <p style={{ marginTop: '20px', color: '#64748b', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Premium AU Contents
      </p>
    </div>
  );
};

export default OpeningScreen;