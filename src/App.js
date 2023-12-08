import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginPage from './Components/Login';
import ProjectsPage from "./Components/ProjectsList";
import RegisterPage from "./Components/RegisterPage";
import ProjectPage from "./Components/ProjectPage";
import CreateTask from "./Components/CreateTask";
import UpdateTask from "./Components/UpdateTask";
import CreateProject from "./Components/CreateProject";
import UpdateProject from "./Components/UpdateProject";

function App() {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
    return (
        <Router>
            <Navbar user={user}/>
            <Routes>
                <Route path="/" element={<ProjectsPage userId={user.id}/>} />
                <Route path="/login" element={<LoginPage setUser={setUser}/>} />
                <Route path="/register" element={<RegisterPage setUser={setUser}/>} />
                <Route path="/create-project" element={<CreateProject userId={user.id} />} />
                <Route path="/update-project/:projectId" element={<UpdateProject userId={user.id} />} />
                <Route path="/projects/:projectId" element={<ProjectPage userId={user.id} />} />
                <Route path="/projects/:projectId/create-task" element={<CreateTask />} />
                <Route path="/projects/:projectId/update-task/:taskId" element={<UpdateTask />} />
            </Routes>
        </Router>
    );
}

export default App;
