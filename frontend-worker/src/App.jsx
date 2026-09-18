import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import TaskList from "./pages/TaskList";
import ResolveTask from "./pages/ResolveTask";

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
  const [workerId, setWorkerId] = useState(null);
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
       setWorkerId(window.currentUserId); // Using the userId as workerId
    } else {
       alert("Login failed");
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    await originalFetch("/api/auth/register", {
       method: "POST", headers:{"Content-Type":"application/json"},
       body: JSON.stringify({name: email, email, password, role: "WORKER"})
    });
    handleLogin(e);
  }

  if (!token) {
     return <div className="p-4 max-w-sm mx-auto mt-20">
        <h2 className="text-xl mb-4 font-bold">Worker Login</h2>
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
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Worker Task List (ID: {workerId})</h1>
        <Routes>
          <Route path="/" element={<TaskList workerId={workerId} />} />
          <Route path="/resolve/:clusterId" element={<ResolveTask workerId={workerId} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
