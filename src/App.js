import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginPage from './Components/Login';
import ProjectsPage from "./Components/ProjectsList";
import RegisterPage from "./Components/RegisterPage";
import ProjectPage from "./Components/ProjectPage";

function App() {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
    return (
        <Router>
            <Navbar user={user}/>
            <Routes>
                <Route path="/" element={<ProjectsPage userId={user.id}/>} />
                <Route path="/login" element={<LoginPage setUser={setUser}/>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/project/:projectId" element={<ProjectPage userId={user.id} />} />
            </Routes>
        </Router>
    );
}

export default App;
