import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/tasks';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', status: 'pending' });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [apiError, setApiError] = useState('');

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setApiError('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.dueDate) newErrors.dueDate = 'Due date is required.';
    return newErrors;
  };

  const handleAddOrEditTask = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setApiError('');
    try {
      if (editId) {
        // Update task
        const res = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            due_date: form.dueDate,
            status: form.status,
          }),
        });
        if (!res.ok) throw new Error('Failed to update task');
        const updated = await res.json();
        setTasks(tasks.map(task => task._id === editId ? updated : task));
      } else {
        // Add task
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            due_date: form.dueDate,
            status: form.status,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to add task');
        }
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
      }
      setForm({ title: '', description: '', dueDate: '', status: 'pending' });
      setErrors({});
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.due_date ? task.due_date.substring(0, 10) : '',
      status: task.status,
    });
    setEditId(task._id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    setApiError('');
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setApiError(err.message);
    }
  };

  // Filter and search logic
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Helper to check if a task is overdue
  const isOverdue = (task) => {
    if (task.status === 'completed') return false;
    if (!task.due_date) return false;
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due < today;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Task List</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <input
            type="text"
            placeholder="Search by title..."
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', description: '', dueDate: '', status: 'pending' }); setErrors({}); }}
          >
            Add Task
          </button>
        </div>
      </div>

      {apiError && <div className="mb-4 text-red-500">{apiError}</div>}
      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : (
        <>
          {/* Add/Edit Task Form (Modal Style) */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <form
                className="bg-white p-6 rounded shadow-md w-full max-w-md relative"
                onSubmit={handleAddOrEditTask}
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={() => { setShowForm(false); setErrors({}); setEditId(null); }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Task' : 'Add Task'}</h3>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    value={form.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    name="description"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    value={form.description}
                    onChange={handleInputChange}
                  />
                  {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                    value={form.dueDate}
                    onChange={handleInputChange}
                  />
                  {errors.dueDate && <div className="text-red-500 text-sm mt-1">{errors.dueDate}</div>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Status</label>
                  <select
                    name="status"
                    className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
                    value={form.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold"
                >
                  {editId ? 'Update Task' : 'Add Task'}
                </button>
              </form>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm relative">
                <h3 className="text-lg font-bold mb-4">Delete Task</h3>
                <p>Are you sure you want to delete this task?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`rounded shadow p-4 border-l-4 transition-colors duration-200
                  ${isOverdue(task) ? 'border-red-500 bg-red-50' :
                    task.status === 'completed' ? 'border-green-500 bg-green-50' :
                    'border-blue-500 bg-white'}`}
              >
                <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                <p className="text-gray-600 mb-2">{task.description}</p>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span>Due: <span className={isOverdue(task) ? 'text-red-500 font-bold' : ''}>{task.due_date ? task.due_date.substring(0, 10) : ''}</span></span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${isOverdue(task) ? 'bg-red-100 text-red-700' :
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="text-blue-500 hover:underline text-sm" onClick={() => handleEdit(task)}>Edit</button>
                  <button className="text-red-500 hover:underline text-sm" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TaskList; 