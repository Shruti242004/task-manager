import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks/my-tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task updated');
      loadTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  return (
    <div>
      <h1 style={{marginBottom: '2rem'}}>My Tasks</h1>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>
                  <div style={{fontWeight: 500}}>{task.title}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{task.description}</div>
                </td>
                <td>{task.project?.name}</td>
                <td>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}</td>
                <td>
                  <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <select 
                    className="input-control" 
                    style={{padding: '0.25rem 0.5rem', width: 'auto'}}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} style={{textAlign: 'center', color: 'var(--text-muted)'}}>No tasks assigned to you.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
