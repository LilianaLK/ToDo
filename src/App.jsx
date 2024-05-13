import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await fetch("https://jsonplaceholder.typicode.com/todos");
        const tasksData = await tasksResponse.json();

        const usersResponse = await fetch("https://jsonplaceholder.typicode.com/users");
        const usersData = await usersResponse.json();

        const formattedTasks = tasksData.map(task => {
          const user = usersData.find(user => user.id === task.userId);
          return {
            id: task.id,
            text: task.title,
            completed: task.completed,
            userName: user ? user.name : "Unknown"
          };
        });
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const users = [...new Set(tasks.map(task => task.userName))];

  const addTask = (text) => {
    if (text.trim() !== "") {
      setTasks([...tasks, { id: tasks.length, text, completed: false, userName: "Лилиана Калинникова" }]);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, taskText) => {
    setEditTaskId(taskId);
    setEditTaskText(taskText);
  };

  const saveEdit = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text: editTaskText } : task
    ));
    setEditTaskId(null);
    setEditTaskText("");
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") {
      return !task.completed;
    } else if (filter === "completed") {
      return task.completed;
    } else {
      return true;
    }
  }).filter(task => selectedUser === "" || task.userName === selectedUser);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <form onSubmit={(e) => { e.preventDefault(); addTask(e.target.elements[0].value); e.target.reset(); }}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form>
      <div className="filters btn-group stack-exception">
        <button type="button" className={`btn toggle-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter("all")}>
          <span className="visually-hidden">Show </span>
          <span>All</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className={`btn toggle-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter("active")}>
          <span className="visually-hidden">Show </span>
          <span>Active</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className={`btn toggle-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter("completed")}>
          <span className="visually-hidden">Show </span>
          <span>Completed</span>
          <span className="visually-hidden"> tasks</span>
        </button>
      </div>
      <div className="filters btn-group stack-exception">
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>
      <h2 id="list-heading">Tasks remaining: {tasks.filter(task => !task.completed).length}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {filteredTasks.map(task => (
          <li key={task.id} className="todo stack-small">
            <div className="c-cb">
              <input
                id={`todo-${task.id}`}
                type="checkbox"
                defaultChecked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <label className="todo-label" htmlFor={`todo-${task.id}`}>
                {editTaskId === task.id ? (
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                ) : (
                  task.text
                )}
              </label>
              <div>Assigned to: {task.userName}</div>
            </div>
            <div className="btn-group">
              {editTaskId === task.id ? (
                <>
                  <button type="button" className="btn" onClick={() => saveEdit(task.id)}>
                    Save
                  </button>
                  <button type="button" className="btn btn__danger" onClick={() => setEditTaskId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn" onClick={() => editTask(task.id, task.text)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn__danger" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
