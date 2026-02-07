import React, { useEffect, useState } from 'react';

interface Subject {
  id: number;
  subject_code: string;
  title: string;
  description?: string;
  department?: string;
  last_accessed?: string;
}

interface User {
  id: number;
  name: string;
  department: string;
  email?: string;
}

interface DashboardProps {
  user: User;
  searchQuery: string;
  searchResults: Subject[];
  selectedSem: number | null;
  semSubjects: Subject[];
  isSearching: boolean;
  onSelectSubject: (subject: Subject) => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user, searchQuery, searchResults, selectedSem, semSubjects, isSearching, onSelectSubject, onLogout, onSearch
}) => {
  const [history, setHistory] = useState<Subject[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const styles = {
    container: { flex: 1, backgroundColor: '#fff', minHeight: '100vh', padding: '60px 80px', fontFamily: '"Inter", sans-serif', position: 'relative' as const },
    heading: { fontSize: '28px', fontWeight: 900, color: '#1e293b', marginTop: '60px', marginBottom: '25px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
    box: { position: 'relative' as const, aspectRatio: '1.1/1' as any, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s' },
    errorBox: { padding: '40px', backgroundColor: '#fff1f2', color: '#be123c', borderRadius: '20px', border: '1px solid #fecdd3', gridColumn: '1 / -1', textAlign: 'center' as const },
    searchInput: { width: '100%', padding: '16px 20px', fontSize: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', backgroundColor: '#f8fafc' },
    searchButton: { marginLeft: '12px', padding: '16px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }
  };

  useEffect(() => { setLocalSearchQuery(searchQuery); }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery && !selectedSem && user?.id) {
      fetch(`http://localhost:5000/api/history/${user.id}`).then(res => res.json()).then(setHistory).catch(console.error);
    }
  }, [user.id, searchQuery, selectedSem]);

  // --- RENDER SEMESTER VIEW ---
  if (selectedSem && !searchQuery) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900 }}>Semester {selectedSem} Subjects</h2>
          <button onClick={() => onSearch('')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold' }}>Back to Home</button>
        </div>
        <div style={styles.grid}>
          {isSearching ? <p>Loading...</p> : semSubjects.map((sub) => (
            <div key={sub.id} style={styles.box} onClick={() => onSelectSubject(sub)}>
              <i className="fas fa-book" style={{ color: '#2563eb' }}></i>
              <div><p style={{ fontSize: '10px', fontWeight: 'bold', color: '#2563eb' }}>{sub.subject_code}</p><h4 style={{ fontWeight: 800 }}>{sub.title}</h4></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER SEARCH RESULTS ---
  if (searchQuery) {
    return (
      <div style={styles.container}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '30px' }}>Results for "{searchQuery}"</h2>
        <div style={styles.grid}>
          {searchResults.length > 0 ? searchResults.map((sub) => (
            <div key={sub.id} style={styles.box} onClick={() => onSelectSubject(sub)}>
              <i className="fas fa-search" style={{ color: '#03102cff' }}></i>
              <div><p style={{ fontSize: '10px', fontWeight: 'bold', color: '#2563eb' }}>{sub.subject_code}</p><h4 style={{ fontWeight: 800 }}>{sub.title}</h4></div>
            </div>
          )) : <div style={styles.errorBox}>No results found</div>}
        </div>
      </div>
    );
  }

  // --- DEFAULT DASHBOARD ---
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: '72px', fontWeight: 900, letterSpacing: '-4px' }}>Welcome back </h1>
      <div style={{ display: 'flex', marginTop: '30px', maxWidth: '600px' }}>
        <input style={styles.searchInput} value={localSearchQuery} onChange={(e) => setLocalSearchQuery(e.target.value)} placeholder="Search subjects..." />
        <button style={styles.searchButton} onClick={() => onSearch(localSearchQuery)}>Search</button>
      </div>
      <h2 style={styles.heading}>Recent Summaries</h2>
      <div style={styles.grid}>
        {history.map((h) => (
          <div key={h.id} style={styles.box} onClick={() => onSelectSubject(h)}>
            <i className="fas fa-book-open" style={{ color: '#2563eb' }}></i>
            <div><p style={{ fontSize: '10px', fontWeight: 900, color: '#2563eb' }}>{h.subject_code}</p><h4 style={{ fontWeight: 800 }}>{h.title}</h4></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;