import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function WorkspaceSwitcher({ current }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition" 
        type="button"
      >
        {current === 'authority' && <><i className="ph-duotone ph-buildings text-emerald-700 text-sm"></i><span>City Operations <span className="text-slate-400 font-normal">(Authority)</span></span></>}
        {current === 'citizen' && <><span className="w-2 h-2 rounded-full bg-civic-500"></span><span>Citizen Portal</span></>}
        {current === 'worker' && <><i className="ph-duotone ph-wrench text-amber-600 text-sm"></i><span>Worker App</span></>}
        <i className="ph ph-caret-down text-slate-400 text-xs ml-0.5"></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Portal</div>
          <button onClick={() => { setIsOpen(false); navigate('/'); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-civic-700 transition-colors flex items-center gap-2.5">
             <span className="w-2 h-2 rounded-full bg-civic-500"></span> Citizen Portal
          </button>
          <button onClick={() => { setIsOpen(false); navigate('/operations'); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors flex items-center gap-2.5">
             <i className="ph-duotone ph-buildings text-emerald-600 text-sm"></i> City Operations
          </button>
          <button onClick={() => { setIsOpen(false); navigate('/worker'); }} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-700 transition-colors flex items-center gap-2.5">
             <i className="ph-duotone ph-wrench text-amber-600 text-sm"></i> Worker App
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopBar() {
  const location = useLocation();
  const isAuthority = location.pathname.startsWith('/operations');
  const isWorker = location.pathname.startsWith('/worker');
  const isCitizen = !isAuthority && !isWorker;

  if (isAuthority) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-6 shrink-0">
              <Link to="/operations" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/30 group-hover:bg-emerald-800 transition-colors">
                  <i className="ph-bold ph-shield-check text-lg"></i>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Civic<span className="text-emerald-700">flow</span></span>
              </Link>
              <div className="hidden xl:flex items-center">
                <WorkspaceSwitcher current="authority" />
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link to="/operations" className={`px-3.5 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition ${location.pathname === '/operations' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                <i className="ph-bold ph-squares-four text-base text-emerald-700"></i>
                Dashboard
              </Link>
              <Link to="/operations/analytics" className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition ${location.pathname === '/operations/analytics' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                <i className="ph ph-chart-line-up text-base text-slate-400"></i>
                Analytics
              </Link>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative hidden sm:block w-52 md:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <i className="ph ph-magnifying-glass text-sm"></i>
                </span>
                <input type="text" className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder-slate-400 transition" placeholder="Search issues, workers..." />
              </div>
              <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live data <span className="text-emerald-600 font-normal">· Updated now</span></span>
              </div>
              <button aria-label="Notifications" className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition" type="button">
                <i className="ph ph-bell text-lg"></i>
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white ring-2 ring-white">3</span>
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition" type="button">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 ring-2 ring-emerald-600/30">
                  JD
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">Jordan Davis</span>
                  <span className="text-[10px] text-slate-500 leading-none">Authority Admin</span>
                </div>
                <i className="ph ph-caret-down text-slate-400 text-xs hidden md:block"></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Citizen or Worker View Top Bar
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-civic-700 flex items-center justify-center text-white shadow-sm shadow-civic-700/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Civicflow</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
              <WorkspaceSwitcher current={isWorker ? 'worker' : 'citizen'} />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {!isWorker && (
              <>
                <Link to="/" className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-civic-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md'}`}>
                  Dashboard
                  {location.pathname === '/' && <span className="absolute bottom-[-15px] left-0 right-0 h-[2.5px] bg-civic-600 rounded-full"></span>}
                </Link>
                <Link to="/report" className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${location.pathname === '/report' ? 'text-civic-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md'}`}>
                  Report Issue
                  {location.pathname === '/report' && <span className="absolute bottom-[-15px] left-0 right-0 h-[2.5px] bg-civic-600 rounded-full"></span>}
                </Link>
                <Link to="/reports" className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${location.pathname.startsWith('/reports') ? 'text-civic-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md'}`}>
                  My Reports
                  {location.pathname.startsWith('/reports') && <span className="absolute bottom-[-15px] left-0 right-0 h-[2.5px] bg-civic-600 rounded-full"></span>}
                </Link>
              </>
            )}
            {isWorker && (
              <Link to="/worker" className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${location.pathname.startsWith('/worker') ? 'text-civic-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md'}`}>
                Worker Tasks
                {location.pathname.startsWith('/worker') && <span className="absolute bottom-[-15px] left-0 right-0 h-[2.5px] bg-civic-600 rounded-full"></span>}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-48 xl:w-60">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                <i className="ph ph-magnifying-glass"></i>
              </span>
              <input type="text" className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-civic-600 focus:border-transparent transition-all" placeholder="Search reports..." />
            </div>
            <button aria-label="Notifications" className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <i className="ph ph-bell text-xl"></i>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-civic-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white ring-1 ring-white">
                3
              </span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                  JD
                </div>
                <span className="hidden md:block text-xs font-semibold text-slate-800">Jordan Davis</span>
                <i className="ph ph-caret-down text-slate-400 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
