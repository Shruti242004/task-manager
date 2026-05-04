import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/tasks', label: 'My Tasks', icon: CheckSquare },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>
          <CheckSquare className="text-primary" /> 
          TaskFlow
        </h2>
        
        <div style={{marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
          <p style={{fontWeight: 600, fontSize: '0.9rem'}}>{user?.name}</p>
          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{user?.role}</p>
        </div>

        <nav style={{flex: 1}}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none', width: '100%', cursor: 'pointer', color: 'var(--danger)'}}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
