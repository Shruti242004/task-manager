import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', memberIds: [] as number[] });
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '', dueDate: '' });
  
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { 
        ...newTask, 
        projectId: selectedProjectId,
        assigneeId: newTask.assigneeId ? Number(newTask.assigneeId) : undefined
      });
      toast.success('Task assigned successfully');
      setShowTaskModal(false);
      loadProjects();
    } catch (err) {
      toast.error('Failed to assign task');
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
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '1rem'}}>
              <span>{project.tasks?.length || 0} Tasks</span>
              <span>{project.members?.length || 0} Members</span>
            </div>
            
            {/* Show Tasks inside the Project Card */}
            {project.tasks && project.tasks.length > 0 && (
              <div style={{marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                <h4 style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Project Tasks:</h4>
                {project.tasks.map((task: any) => (
                  <div key={task.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.25rem 0'}}>
                    <span style={{fontWeight: 500}}>{task.title}</span>
                    <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            )}
            {isAdmin && (
              <button 
                className="btn btn-outline" 
                style={{marginTop: '1rem', width: '100%', fontSize: '0.8rem', padding: '0.5rem'}}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setNewTask({ title: '', description: '', assigneeId: '', dueDate: '' });
                  setShowTaskModal(true);
                }}
              >
                + Assign Task
              </button>
            )}
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

      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{marginBottom: '1.5rem'}}>Assign New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input required className="input-control" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-control" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Assign To</label>
                <select required className="input-control" value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                  <option value="">Select a member...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Due Date</label>
                <input type="date" className="input-control" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary">Assign Task</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
