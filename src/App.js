import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  //useEffect: good if something has to happen when the page load
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // Fetch task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // Add Task
  const addTask = async (task) => {
    // The json server assigns an id automatically, so this is not needed 
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    // save reminder change on the json server
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })
    const data = await res.json()

    // the thre dots ... mean that it will propagate the change to all the tasks in the list
    setTasks(
      tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task)
    )
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={ () => setShowAddTask(!showAddTask) } showAdd={ showAddTask }/>
        <Route path='/' exact render={ (props) => (
          <>
            {showAddTask && <AddTask onAdd={ addTask } />}
            {tasks.length > 0 ? (<Tasks tasks={ tasks } onDelete={ deleteTask } onToggle={ toggleReminder }/>) : ('No tasks to show')}
          </>
        ) }/>
        <Route path='/about' component={ About }/>
        <Footer />  
      </div>
    </Router>
  );
}

export default App;
