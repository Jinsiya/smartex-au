import React, { useState, useEffect } from 'react';

const Sidebar = ({ onSelectHome, onSelectSubject, onSelectSemester, onSearchChange }: any) => {
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/subjects').then(res => res.json()).then(setSubjects).catch(console.error);
  }, []);

  return (
    <div style={{ width: '280px', backgroundColor: '#1a3a8a', height: '100vh', color: '#fff', padding: '30px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '40px', cursor: 'pointer' }} onClick={onSelectHome}>
        <h1 style={{ fontSize: '24px', fontWeight: '900' }}>Smartex <span style={{ color: '#93c5fd' }}>AU</span></h1>
      </div>

      <button onClick={onSelectHome} style={{ width: '100%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', marginBottom: '30px', cursor: 'pointer' }}>
       HOME
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {[1, 2, 3].map(year => (
          <div key={year} style={{ marginBottom: '10px' }}>
            <div onClick={() => setOpenYear(openYear === year ? null : year)} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              YEAR {year} <span>{openYear === year ? '▼' : '▶'}</span>
            </div>
            {openYear === year && (
              <div style={{ paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)', marginTop: '5px' }}>
                {[1, 2].map(num => {
                  const sem = (year * 2) - (2 - num);
                  return (
                    <div key={sem} style={{ marginBottom: '15px' }}>
                      <p onClick={() => onSelectSemester(sem)} style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '900', cursor: 'pointer', margin: '5px 0' }}>SEM {sem}</p>
                      {subjects.filter(s => s.year === year && s.semester === sem).map(sub => (
                        <button key={sub.id} onClick={() => onSelectSubject(sub)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#cbd5e1', fontSize: '11px', padding: '4px 0', cursor: 'pointer' }}>
                          {sub.subject_code} {sub.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;