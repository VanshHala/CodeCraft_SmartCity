import { useState, useEffect } from 'react'
import ReportForm from './pages/ReportForm'
import IssueMap from './pages/IssueMap'
import RoutePlanner from './pages/RoutePlanner'
import Leaderboard from './pages/Leaderboard'
import Copilot from './pages/Copilot'

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  if(window.jwtToken && typeof resource === 'string' && resource.startsWith('/api')) {
    config = config || {};
    config.headers = { ...config.headers, 'Authorization': `Bearer ${window.jwtToken}` };
    args[1] = config;
  }
  return originalFetch(...args);
};

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const parseJwt = (t) => JSON.parse(atob(t.split('.')[1]));

  const handleLogin = async (e) => {
    e.preventDefault();
    const r = await originalFetch("/auth/login", {
       method: "POST", headers:{"Content-Type":"application/json"},
       body: JSON.stringify({email, password})
    });
    if (r.ok) {
       const data = await r.json();
       window.jwtToken = data.token;
       window.currentUserId = parseJwt(data.token).sub;
       setToken(data.token);
    } else {
       alert("Login failed");
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    await originalFetch("/auth/register", {
       method: "POST", headers:{"Content-Type":"application/json"},
       body: JSON.stringify({name: email, email, password, role: "CITIZEN"})
    });
    handleLogin(e);
  }

  if (!token) {
     return <div className="p-4 max-w-sm mx-auto">
        <h2 className="text-xl mb-4 font-bold">Citizen Login</h2>
        <form onSubmit={handleLogin} className="space-y-2">
           <input className="border p-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
           <input className="border p-2 w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
           <div className="flex gap-2">
             <button type="submit" className="bg-blue-600 text-white p-2 flex-1 rounded">Login</button>
             <button type="button" onClick={handleRegister} className="bg-gray-600 text-white p-2 flex-1 rounded">Register</button>
           </div>
        </form>
     </div>
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <h1 style={{textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '1rem'}}>CivicPulse</h1>
      <Leaderboard />
      <hr style={{margin: '2rem 0'}} />
      <Copilot />
      <hr style={{margin: '2rem 0'}} />
      <ReportForm />
      <hr style={{margin: '2rem 0'}} />
      <IssueMap />
      <hr style={{margin: '2rem 0'}} />
      <RoutePlanner />
    </div>
  )
}
