import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import "../App.css";
import "../Tasks.css";

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // 📥 Fetch Tasks
  const fetchTasks = async () => {
    try {
      let url = `/tasks?page=${page}&sort=${sort}&order=${order}`;

      if (filter !== "All") {
        url += `&status=${filter}`;
      }

      const res = await API.get(url);
      setTasks(res.data.tasks);
      setPages(res.data.pages);
    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // ➕ Add Task
  const addTask = async () => {
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      await API.post("/tasks", { title, description });
      toast.success("Task added successfully 🎉");
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  // ❌ Delete Task
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  // 🔄 Update Status
  const changeStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      toast.success("Status updated");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, page, sort, order]);

  return (
    <div className="app">
      <div className="header">
        <h1>ToDo Manager</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Add Task */}
      <div className="form">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => { setFilter("All"); setPage(1); }}>All</button>
        <button onClick={() => { setFilter("Pending"); setPage(1); }}>Pending</button>
        <button onClick={() => { setFilter("In-Progress"); setPage(1); }}>In-Progress</button>
        <button onClick={() => { setFilter("Completed"); setPage(1); }}>Completed</button>
      </div>

      {/* Sorting */}
      <div className="sorting">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt">Date</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Task List */}
      <div className="list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet 📝</h3>
            <p>Add your first task and stay productive!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              className={`task ${task.status === "Completed" ? "completed" : ""}`}
              key={task._id}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <select
                value={task.status}
                onChange={(e) => changeStatus(task._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span> Page {page} of {pages} </span>

        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Tasks;
