'use client';
import { useState, useEffect } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  ip_address: string;
  submitted_at: string;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [downloads, setDownloads] = useState(0);
  const [adminUser, setAdminUser] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Tab change karne ki naye state track karne ke liye
  const [activeTab, setActiveTab] = useState<'messages' | 'downloads'>('messages');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await fetch('/api/admin/messages');
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
      setDownloads(data.downloads || 0);
      setAdminUser(data.admin || 'Admin');
      setLoggedIn(true);
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      fetchData();
    } else {
      setError(data.message);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setLoggedIn(false);
    setMessages([]);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
    setMessages(messages.filter((m) => m.id !== id));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070f', color: '#00e5c3', fontFamily: 'monospace' }}>
        Loading...
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070f', padding: '2rem' }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #05070f; }
          .card { background: #0e1525; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 3rem 2.5rem; width: 100%; max-width: 400px; }
          .logo { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #e8edf5; margin-bottom: .3rem; }
          .logo span { color: #00e5c3; }
          .sub { color: #8b9ab5; font-size: .85rem; margin-bottom: 2rem; font-family: sans-serif; }
          .fg { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1.2rem; }
          label { font-size: .72rem; color: #3d4f6b; letter-spacing: .1em; text-transform: uppercase; font-family: monospace; }
          input { background: #080c18; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: .8rem 1rem; color: #e8edf5; font-size: .9rem; outline: none; width: 100%; transition: border-color .3s; font-family: sans-serif; }
          input:focus { border-color: #00e5c3; }
          .btn { width: 100%; padding: .85rem; background: linear-gradient(135deg,#00e5c3,#00bfa8); color: #05070f; border: none; border-radius: 10px; font-size: .9rem; font-weight: 600; cursor: pointer; font-family: sans-serif; }
          .err { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); color: #fca5a5; padding: .7rem 1rem; border-radius: 8px; font-size: .83rem; margin-bottom: 1rem; font-family: sans-serif; }
        `}</style>
        <div className="card">
          <div className="logo">AF<span>.</span></div>
          <div className="sub">Portfolio Admin Panel</div>
          {error && <div className="err">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="fg">
              <label>Username</label>
              <input type="text" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="fg">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: '#05070f', color: '#e8edf5', fontFamily: 'sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        .sidebar { background: #080c18; border-right: 1px solid rgba(255,255,255,0.06); padding: 2rem 1.5rem; height: 100vh; position: sticky; top: 0; }
        .logo { font-family: 'Syne',sans-serif; font-size: 1.3rem; font-weight: 800; margin-bottom: 2rem; }
        .logo span { color: #00e5c3; }
        .nav-item { padding: .7rem 1rem; border-radius: 8px; font-size: .88rem; color: #8b9ab5; cursor: pointer; display: flex; align-items: center; gap: .7rem; transition: all 0.2s; }
        .nav-item.active { background: rgba(0,229,195,0.08); color: #00e5c3; font-weight: 600; }
        .nav-item:hover:not(.active) { background: rgba(255,255,255,0.03); color: #e8edf5; }
        .logout { display: block; padding: .7rem 1rem; border-radius: 8px; font-size: .85rem; color: #3d4f6b; text-align: center; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; background: none; width: 100%; margin-top: auto; transition: all .2s; }
        .logout:hover { border-color: #ef4444; color: #fca5a5; }
        .main { padding: 2.5rem; overflow-y: auto; }
        .page-title { font-family: 'Syne',sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: .4rem; }
        .page-sub { color: #8b9ab5; font-size: .88rem; margin-bottom: 2.5rem; }
        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .stat { background: #0e1525; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 1.5rem; cursor: pointer; transition: transform 0.2s; }
        .stat:hover { transform: translateY(-2px); }
        .stat-num { font-family: 'Syne',sans-serif; font-size: 2.2rem; font-weight: 800; color: #00e5c3; }
        .stat-label { font-size: .78rem; color: #3d4f6b; text-transform: uppercase; letter-spacing: .08em; margin-top: .3rem; font-family: monospace; }
        .sec-title { font-family: 'Syne',sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.2rem; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: .7rem; color: #3d4f6b; font-family: monospace; letter-spacing: .1em; text-transform: uppercase; padding: .6rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: .87rem; vertical-align: top; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .td-name { font-weight: 500; }
        .td-email { color: #00e5c3; font-size: .8rem; }
        .td-msg { color: #8b9ab5; max-width: 320px; line-height: 1.5; }
        .td-date { color: #3d4f6b; font-family: monospace; font-size: .72rem; white-space: nowrap; }
        .del-btn { padding: .3rem .7rem; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; border-radius: 6px; font-size: .75rem; cursor: pointer; transition: all .2s; }
        .del-btn:hover { background: rgba(239,68,68,0.2); }
        .badge { display: inline-block; padding: .15rem .55rem; border-radius: 100px; font-size: .67rem; font-family: monospace; background: rgba(0,229,195,0.08); border: 1px solid rgba(0,229,195,0.2); color: #00e5c3; }
        .empty { text-align: center; padding: 3rem; color: #3d4f6b; font-family: monospace; background: #0e1525; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.05); }
        .sidebar-inner { display: flex; flex-direction: column; height: 100%; }
        .nav-items { display: flex; flex-direction: column; gap: .5rem; flex: 1; }
      `}</style>
      
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="logo">AF<span>.</span></div>
          <div className="nav-items">
            {/* Click handlers added to tabs */}
            <div 
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              📬 Messages
            </div>
            <div 
              className={`nav-item ${activeTab === 'downloads' ? 'active' : ''}`}
              onClick={() => setActiveTab('downloads')}
            >
              📥 Downloads
            </div>
          </div>
          <button className="logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Welcome back, {adminUser}!</div>
        
        <div className="stats">
          <div className="stat" onClick={() => setActiveTab('messages')}>
            <div className="stat-num">{messages.length}</div>
            <div className="stat-label">Total Messages</div>
          </div>
          <div className="stat" onClick={() => setActiveTab('downloads')}>
            <div className="stat-num">{downloads}</div>
            <div className="stat-label">Resume Downloads</div>
          </div>
          <div className="stat">
            <div className="stat-num">{new Date().getFullYear()}</div>
            <div className="stat-label">Portfolio Year</div>
          </div>
        </div>

        {/* Dynamic content rendering based on activeTab */}
        {activeTab === 'messages' ? (
          <>
            <div className="sec-title">Contact Messages</div>
            {messages.length === 0 ? (
              <div className="empty">No messages yet.</div>
            ) : (
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Message</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {messages.map((msg, i) => (
                    <tr key={msg.id}>
                      <td><span className="badge">{i + 1}</span></td>
                      <td>
                        <div className="td-name">{msg.name}</div>
                        <div className="td-email">{msg.email}</div>
                      </td>
                      <td className="td-msg">{msg.message}</td>
                      <td className="td-date">{new Date(msg.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><button className="del-btn" onClick={() => handleDelete(msg.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>
            <div className="sec-title">Resume Downloads Analytics</div>
            <div className="empty">
              📈 Total {downloads} users have downloaded your resume directly from the portfolio.
            </div>
          </>
        )}
      </div>
    </div>
  );
}