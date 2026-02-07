import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { AuthScreen } from './components/Login';
import OpeningScreen from './components/OpeningScreen';
import { getAIResponse } from './services/api';

interface Subject { 
  id: number; 
  subject_code: string; 
  title: string; 
  description?: string; 
  content?: string; 
  image_url?: string; 
}
interface User { id: number; name: string; department: string; }
interface ChatMessage { q: string; a: string; }

const App: React.FC = () => {
  // 1. STATE DECLARATIONS
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Subject[]>([]);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [semSubjects, setSemSubjects] = useState<Subject[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [history, setHistory] = useState<Subject[]>([]);
  
  // AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState<ChatMessage[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Unit State
  const [units, setUnits] = useState<any[]>([]);
  const [activeUnit, setActiveUnit] = useState<any>(null);

  // 2. TIMERS & PERSISTENCE
  useEffect(() => { 
    const timer = setTimeout(() => setShowSplash(false), 3000); 
    return () => clearTimeout(timer);
  }, []);

  const loadHistoryFromDB = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/history/${userId}`);
      if (res.ok) setHistory(await res.json());
    } catch (e) { console.error("History error:", e); }
  };

  // 3. HANDLERS
  const handleSearch = async (query: string) => {
    setSearchQuery(query); 
    setSelectedSem(null);
    if (query.trim()) {
      setSelectedSubject(null); 
      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/subjects/search?q=${query}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (e) { setSearchResults([]); }
      finally { setIsSearching(false); }
    }
  };

  const handleSelectSemester = async (sem: number) => {
    setSelectedSem(sem); 
    setSearchQuery(""); 
    setSelectedSubject(null); 
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/semester/${sem}`);
      const data = await res.json();
      setSemSubjects(Array.isArray(data) ? data : []);
    } catch (e) { setSemSubjects([]); }
    finally { setIsSearching(false); }
  };

  const handleSelectSubject = async (subject: Subject) => {
    setSelectedSubject(subject); 
    setSearchQuery(""); 
    setSelectedSem(null);
    try {
      const unitRes = await fetch(`http://localhost:5000/api/subjects/${subject.id}/units`);
      const unitData = await unitRes.json();
      setUnits(Array.isArray(unitData) ? unitData : []);
      setActiveUnit(unitData[0] || null);
      
      await fetch('http://localhost:5000/api/history', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ userId: user?.id, subjectId: subject.id }) 
      });
      if (user) loadHistoryFromDB(user.id);
    } catch (e) { console.error("Subject load error:", e); }
  };

  const handleGoHome = () => { 
    setSelectedSubject(null); 
    setSearchQuery(""); 
    setSelectedSem(null); 
    setIsAiOpen(false); 
  };

  const handleLogout = () => { setUser(null); handleGoHome(); };

  const handleAskAi = async () => {
    if (!aiInput.trim() || !selectedSubject) return;
    const q = aiInput; setAiInput(""); setLoadingAi(true);
    try {
      const response = await getAIResponse(`Subject: ${selectedSubject.title}. Question: ${q}`);
      setAiChat(prev => [...prev, { q, a: response }]);
    } catch (err) {
      setAiChat(prev => [...prev, { q, a: "Error connecting to AI. Please try again." }]);
    } finally { setLoadingAi(false); }
  };

  // 4. VIEW LOGIC
  if (showSplash) return <OpeningScreen onFadeComplete={() => setShowSplash(false)} />;
  if (!user) return <AuthScreen onAuthSuccess={(u: any) => { 
    setUser({id: u.id, name: u.full_name || u.name, department: u.department}); 
    loadHistoryFromDB(u.id); 
  }} />;

  const styles: Record<string, React.CSSProperties> = {
    main: { flex: 1, overflowY: 'auto', backgroundColor: '#ffffff', borderTopLeftRadius: '3.5rem', position: 'relative' as 'relative' },
    floatingAiBtn: { position: 'fixed', bottom: '40px', right: '40px', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 100, border: '4px solid #fff' },
    aiDrawer: { position: 'fixed', top: 0, right: isAiOpen ? 0 : '-450px', width: '400px', height: '100vh', backgroundColor: '#fff', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', zIndex: 1000, transition: 'right 0.4s ease', display: 'flex', flexDirection: 'column' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999, display: isAiOpen ? 'block' : 'none' }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#020617', overflow: 'hidden' }}>
      <Sidebar onSelectHome={handleGoHome} onSelectSubject={handleSelectSubject} onSelectSemester={handleSelectSemester} onSearchChange={handleSearch} />
      
      <main style={styles.main}>
        {selectedSubject && !searchQuery ? (
          <div style={{ padding: '80px', maxWidth: '1000px', margin: '0 auto' }}>
            <button onClick={handleGoHome} style={{ color: '#2563eb', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            
            <div style={{ marginBottom: '40px' }}>
                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{selectedSubject.subject_code}</span>
                <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#0f172a', margin: '10px 0' }}>{selectedSubject.title}</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', margin: '30px 0', overflowX: 'auto', paddingBottom: '10px' }}>
              {units.map(u => (
                <button 
                  key={u.id} 
                  onClick={() => setActiveUnit(u)} 
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    backgroundColor: activeUnit?.id === u.id ? '#0f172a' : '#f1f5f9', 
                    color: activeUnit?.id === u.id ? '#fff' : '#64748b', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    whiteSpace: 'nowrap'
                  }}
                >
                  Unit {u.unit_number}
                </button>
              ))}
            </div>

            {activeUnit ? (
              <div style={{ padding: '40px', backgroundColor: '#fcfcfc', borderRadius: '30px', border: '1px solid #f1f5f9', minHeight: '500px' }}>
                 <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '25px', color: '#1e293b' }}>{activeUnit.title}</h2>
                 {activeUnit.image_url && (
                    <img src={activeUnit.image_url} style={{ width: '100%', borderRadius: '20px', marginBottom: '30px' }} alt="Study material" />
                 )}
                 <div style={{ color: '#334155', lineHeight: '1.8', fontSize: '17px' }} dangerouslySetInnerHTML={{ __html: activeUnit.content }} />
              </div>
            ) : (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '50px' }}>Select a unit to start reading.</p>
            )}

            {/* UPDATED FLOATING AI BUTTON WITH ROBOT LOGO */}
            <div style={styles.floatingAiBtn} onClick={() => setIsAiOpen(true)}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
              <div style={{ position: 'absolute', top: '5px', right: '5px', width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid #0f172a' }}></div>
            </div>
            
            <div style={styles.overlay} onClick={() => setIsAiOpen(false)}></div>
            
            <div style={styles.aiDrawer}>
                <div style={{ padding: '25px', backgroundColor: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600' }}>AI ASSISTANT</span>
                    <i className="fas fa-times" onClick={() => setIsAiOpen(false)} style={{ cursor: 'pointer' }}></i>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {aiChat.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px' }}>Ask a doubt about {selectedSubject.title}...</p>}
                    {aiChat.map((c, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', fontSize: '14px', marginBottom: '5px' }}><b>You:</b> {c.q}</div>
                            <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', marginTop: '5px', fontSize: '14px', border: '1px solid #dbeafe' }}><b>AI:</b> {c.a}</div>
                        </div>
                    ))}
                    {loadingAi && <p style={{ color: '#2563eb', textAlign: 'center', fontSize: '12px' }}>AI is thinking...</p>}
                </div>
                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    <input style={{ width: '100%', padding: '12px 15px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }} value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskAi()} placeholder="Type a doubt..." />
                </div>
            </div>
          </div>
        ) : (
          <Dashboard user={user} searchQuery={searchQuery} searchResults={searchResults} selectedSem={selectedSem} semSubjects={semSubjects} isSearching={isSearching} onSelectSubject={handleSelectSubject} onLogout={handleLogout} onSearch={handleSearch} />
        )}
      </main>
    </div>
  );
};

export default App;