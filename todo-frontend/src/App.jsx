import { useEffect, useState } from "react";
import API from "./api/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

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
    }
  };

  const addTask = async () => {
    if (!title) return;

    try {
      await API.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, page, sort, order]);

  return (
    <div className="app">
      <h1>ToDo Manager</h1>

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
        {tasks.map((task) => (
          <div className="task" key={task._id}>
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

            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </div>
        ))}
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

export default App;
