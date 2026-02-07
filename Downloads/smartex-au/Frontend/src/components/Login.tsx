import React, { useState } from 'react';

export const AuthScreen = ({ onAuthSuccess }: any) => {
    const [step, setStep] = useState('choice');
    const [form, setForm] = useState({ email: '', password: '', otp: '', name: '' });
    const [loading, setLoading] = useState(false);

    const handleApi = async (path: string, body: object) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/auth/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) return data;
            alert(data.error);
        } catch (e) { alert("Backend is offline. Run 'node server.js'"); }
        finally { setLoading(false); }
    };

    const s = {
        card: { backgroundColor: '#fff', width: '400px', borderRadius: '3rem', padding: '50px', textAlign: 'center' as 'center', fontFamily: 'sans-serif' },
        input: { width: '100%', padding: '20px', marginBottom: '15px', borderRadius: '1.5rem', border: '1px solid #eee', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box' as 'border-box' },
        btn: { width: '100%', padding: '20px', borderRadius: '1.5rem', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold' as 'bold', cursor: 'pointer' }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={s.card}>
                {step === 'choice' && (
                    <>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '40px' }}>Smartex AU</h2>
                        <button style={s.btn} onClick={() => setStep('login')}>Login to Account</button>
                        <button style={{ ...s.btn, backgroundColor: '#f1f5f9', color: '#475569', marginTop: '12px' }} onClick={() => setStep('reg_email')}>Create New Account</button>
                    </>
                )}

                {step === 'login' && (
                    <>
                        <h3 style={{ marginBottom: '20px', fontWeight: '900' }}>Login</h3>
                        <input style={s.input} placeholder="Email or Username" onChange={e => setForm({...form, email: e.target.value})} />
                        <input style={s.input} type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
                        <button style={s.btn} onClick={async () => {
                            const d = await handleApi('login', { identifier: form.email, password: form.password });
                            if (d) onAuthSuccess(d.user);
                        }}>{loading ? "Verifying..." : "Sign In"}</button>
                    </>
                )}

                {step === 'reg_email' && (
                    <>
                        <h3>New Account</h3>
                        <input style={s.input} placeholder="Gmail Address" onChange={e => setForm({...form, email: e.target.value})} />
                        <button style={s.btn} onClick={async () => {
                            const d = await handleApi('register-otp', { identifier: form.email });
                            if (d) setStep('reg_otp');
                        }}>Get OTP</button>
                    </>
                )}

                {step === 'reg_otp' && (
                    <>
                        <h3>Verify Code</h3>
                        <input style={{ ...s.input, textAlign: 'center', fontSize: '24px' }} placeholder="000000" onChange={e => setForm({...form, otp: e.target.value})} />
                        <button style={s.btn} onClick={() => setStep('reg_profile')}>Next</button>
                    </>
                )}

                {step === 'reg_profile' && (
                    <>
                        <h3>Profile Info</h3>
                        <input style={s.input} placeholder="Your Name" onChange={e => setForm({...form, name: e.target.value})} />
                        <input style={s.input} type="password" placeholder="Create Password" onChange={e => setForm({...form, password: e.target.value})} />
                        <button style={s.btn} onClick={async () => {
                            const d = await handleApi('register-finalize', { identifier: form.email, code: form.otp, password: form.password, fullName: form.name });
                            if (d) onAuthSuccess(d.user);
                        }}>Complete & Start</button>
                    </>
                )}

                {step !== 'choice' && <button style={{ background: 'none', border: 'none', marginTop: '30px', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setStep('choice')}>← Go Back</button>}
            </div>
        </div>
    );
};