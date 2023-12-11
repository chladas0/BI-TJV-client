import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Container,
    Box,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Fab, CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const fetchProjects = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/users/${userId}/projects`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

const fetchUnfinishedTasks = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/users/${userId}/unfinishedTasks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unfinished tasks:', error);
    }
};

const ProjectsPage = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [deletingProject, setDeletingProject] = useState(null);
    const [unfinishedTasks, setUnfinishedTasks] = useState([]);
    const [showUnfinishedTasks, setShowUnfinishedTasks] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndSetProjects = async () => {
            try {
                const fetchedProjects = await fetchProjects(userId);
                if (fetchedProjects) {
                    setProjects(fetchedProjects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        const fetchAndSetUnfinishedTasks = async () => {
            try {
                const tasks = await fetchUnfinishedTasks(userId);
                setUnfinishedTasks(tasks);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching unfinished tasks:', error);
            }
        };

        if (userId) {
            fetchAndSetProjects();
            fetchAndSetUnfinishedTasks();
        }

    }, [userId]);

    const handleCreateProjectClick = () => {
        navigate('/create-project');
    };

    const handleEditClick = (projectId) => {
        navigate(`/update-project/${projectId}`);
    };

    const handleDeleteClick = (projectId) => {
        setDeletingProject(projectId);
    };

    const findProjectByTaskId = (taskId) => {
        for (const project of projects) {
            if (project.tasksIds.includes(taskId)) {
                return project;
            }
        }
        return null;
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8080/projects/${deletingProject}`);
            const updatedProjects = await fetchProjects(userId);
            setProjects(updatedProjects);
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project');
        } finally {
            setDeletingProject(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeletingProject(null);
    };

    const handleShowTasksClick = () => {
        setShowUnfinishedTasks(!showUnfinishedTasks);
    };

    const handleUnfinishedTaskClick = (taskId) => {
        const projectId = findProjectByTaskId(taskId).id;
        navigate(`/projects/${projectId}`);
    };


    if(!userId) {
        return (
            <Typography variant="h6" style={{ marginTop: '20px', textAlign: 'center'}}>
                You must be logged in to see projects.
            </Typography>
        )
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ padding: '20px' }}>
                Your Projects
            </Typography>
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4}
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        sx={{
                            '&:hover': {
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                transform: 'scale(1.02)',
                            },
                        }}
                    >
                        <Card>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h5" component="h2">
                                    {project.name}
                                </Typography>
                                <Box>
                                    <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(project.id);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(project.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleShowTasksClick}
                        style={{ marginTop: '20px' }}
                    >
                        {showUnfinishedTasks ? 'Hide Unfinished Tasks' : 'Show Unfinished Tasks'}
                    </Button>
                </Grid>

                {showUnfinishedTasks && (
                    <Grid item xs={12}>
                        {unfinishedTasks.length > 0 ? (
                            <>
                                <Typography variant="h4" style={{ marginBottom: '20px', color: '#8b0000' }}>
                                    Unfinished Tasks
                                </Typography>
                                <Grid container spacing={3}>
                                    {unfinishedTasks.map((task) => (
                                        <Grid item xs={12} md={4} key={task.id} onClick={() => handleUnfinishedTaskClick(task.id)}>
                                            <Card sx={{ cursor: 'pointer', marginBottom: '20px' }}>
                                                <CardContent>
                                                    <Box>
                                                        <KeyValuePair label="Name" value={task.taskName} />
                                                        <KeyValuePair label="Due Date" value={formatDate(task.dueDate)} />
                                                        <KeyValuePair label="Project" value={findProjectByTaskId(task.id).name} />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) : (
                            <Typography variant="h6" style={{ marginTop: '20px', color: '#555' }}>
                                All tasks are finished. You can rest now!
                            </Typography>
                        )}
                    </Grid>
                )}

                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: '16px',
                        right: '16px',
                        width: '70px',
                        height: '70px',
                    }}
                    onClick={handleCreateProjectClick}
                >
                    <AddIcon />
                </Fab>
            </Grid>

            <Dialog open={deletingProject !== null} onClose={handleDeleteCancel}>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const KeyValuePair = ({ label, value }) => (
    <Typography variant="body2" sx={{ marginBottom: '8px' }}>
        <strong>{label}:</strong> {value}
    </Typography>
);

export default ProjectsPage;
