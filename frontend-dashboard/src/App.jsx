import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";

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

function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const parseJwt = (t) => JSON.parse(atob(t.split('.')[1]));

  const handleLogin = async (e) => {
    e.preventDefault();
    const r = await originalFetch("/api/auth/login", {
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
    await originalFetch("/api/auth/register", {
       method: "POST", headers:{"Content-Type":"application/json"},
       body: JSON.stringify({name: email, email, password, role: "AUTHORITY"})
    });
    handleLogin(e);
  }

  if (!token) {
     return <div className="p-4 max-w-sm mx-auto mt-20">
        <h2 className="text-xl mb-4 font-bold">Authority Login</h2>
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
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-6 text-xl font-bold border-b border-gray-800">Authority Dashboard</div>
          <nav className="flex-1 p-4 space-y-2">
            <NavItem to="/" label="Overview" />
            <NavItem to="/analytics" label="Analytics" />
          </nav>
        </div>
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function NavItem({ to, label }) {
  const active = useLocation().pathname === to;
  return (
    <Link to={to} className={`block px-4 py-2 rounded ${active ? "bg-gray-800" : "hover:bg-gray-800"}`}>
      {label}
    </Link>
  );
}

export default App;
