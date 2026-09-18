import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';

export default function AppLayout() {
  const location = useLocation();
  const isAuthority = location.pathname.startsWith('/operations');

  // The design uses different max-widths for citizen (1440px) vs authority (1720px)
  const maxWidthClass = isAuthority ? "max-w-[1720px]" : "max-w-[1440px]";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <TopBar />
      <main className={`flex-1 ${maxWidthClass} w-full mx-auto px-4 sm:px-6 lg:px-8 py-7`}>
        <Outlet />
      </main>
      
      <footer className="border-t border-slate-200/80 bg-white mt-auto">
        <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{isAuthority ? 'Civicflow Operations System' : 'Civicflow NYC'}</span>
            <span>·</span>
            <span>{isAuthority ? 'NY Metropolitan Municipal Authority' : 'Civic Engagement Platform'}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className={`hover:${isAuthority ? 'text-emerald-700' : 'text-slate-800'} transition`}>Support Center</a>
            <a href="#" className={`hover:${isAuthority ? 'text-emerald-700' : 'text-slate-800'} transition`}>Privacy Policy</a>
            <a href="#" className={`hover:${isAuthority ? 'text-emerald-700' : 'text-slate-800'} transition`}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
