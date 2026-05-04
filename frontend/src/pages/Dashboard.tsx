import { useEffect, useState } from 'react';
import { FolderKanban, CheckSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, overdue: 0, completed: 0 });

  useEffect(() => {
    api.get('/dashboard').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, color: 'var(--primary)' },
    { label: 'Active Tasks', value: stats.tasks, icon: CheckSquare, color: '#3B82F6' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'var(--success)' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'var(--danger)' },
  ];

  return (
    <div>
      <h1 style={{marginBottom: '2rem'}}>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="card" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{backgroundColor: `${stat.color}20`, color: stat.color, padding: '1rem', borderRadius: '12px'}}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500}}>{stat.label}</p>
              <h3 style={{fontSize: '1.5rem', fontWeight: 700}}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card">
        <h3>Welcome to TaskFlow</h3>
        <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
          Manage your projects and track progress efficiently. Navigate to Projects to see your team's work, or check My Tasks for your specific assignments.
        </p>
      </div>
    </div>
  );
}
