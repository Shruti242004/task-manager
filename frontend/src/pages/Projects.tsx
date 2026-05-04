import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', memberIds: [] as number[] });
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'Admin';

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    }
  };

  const loadUsers = async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project created');
      setShowModal(false);
      loadProjects();
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1>Projects</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Create Project
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {projects.map(project => (
          <div key={project.id} className="card">
            <h3>{project.name}</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: '1rem'}}>
              {project.description || 'No description'}
            </p>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
              <span>{project.tasks?.length || 0} Tasks</span>
              <span>{project.members?.length || 0} Members</span>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p>No projects found.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginBottom: '1.5rem'}}>New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Name</label>
                <input required className="input-control" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-control" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Members (Ctrl+Click to multi-select)</label>
                <select multiple className="input-control" onChange={e => {
                  const options = Array.from(e.target.selectedOptions, option => Number(option.value));
                  setNewProject({...newProject, memberIds: options});
                }}>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
