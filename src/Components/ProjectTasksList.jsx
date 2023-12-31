import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Grid,
    Typography,
    IconButton,
    Card,
    CardContent,
    Box,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";

const TaskList = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const {projectId } = useParams();
    const [projectName, setProjectName] = useState('');
    const [deletingTask, setDeletingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const responseTasks = await axios.get(`http://localhost:8080/projects/${projectId}/tasks`);
                setTasks(responseTasks.data);
                const responseProject = await axios.get(`http://localhost:8080/projects/${projectId}`);
                setProjectName(responseProject.data.name);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
            finally {
                setLoading(false)
            }
        };
        fetchTasks();
    }, [projectId, userId]);

    const handleEditClick = (taskId) => {
        navigate(`/projects/${projectId}/update-task/${taskId}`);
    };

    const handleDeleteClick = (taskId) => {
        setDeletingTask(taskId);
    };

    const handleCreateClick = () => {
        navigate(`/projects/${projectId}/create-task`);
    }

    const handleDeleteCancel = () => {
        setDeletingTask(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8080/tasks/${deletingTask}`);
            const updatedTasks = await axios.get(`http://localhost:8080/projects/${projectId}/tasks`);
            setTasks(updatedTasks.data);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task');
        } finally {
            setDeletingTask(null);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Grid>
            <Typography variant="h4" gutterBottom sx={{ padding: '20px' }}>
                {projectName} - Tasks
            </Typography>
            {tasks.length > 0 ? (
            <Grid container spacing={3} sx={{ padding: '20px' }}>
                {tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card
                            elevation={3}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '16px',
                                marginBottom: '16px',
                                '&:hover': { cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', transform: 'scale(1.02)' },
                            }}
                        >
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {task.taskName}
                                </Typography>
                                <Box>
                                    <KeyValuePair label="Task ID" value={task.id} />
                                    <KeyValuePair label="Creation Date" value={formatDate(task.creationDate)} />
                                    <KeyValuePair label="Due Date" value={formatDate(task.dueDate)} />
                                    <KeyValuePair label="Description" value={task.description} />
                                    <KeyValuePair label="Status" value={task.status} />
                                </Box>
                            </CardContent>

                            <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                                <IconButton
                                    aria-label="edit"
                                    color="primary"
                                    onClick={() => handleEditClick(task.id)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleDeleteClick(task.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>

                        </Card>
                    </Grid>
                ))}
            </Grid>
            ) : (
            <Typography variant="h6" style={{ marginTop: '20px', textAlign: 'center', color: '#555' }}>
                There are no tasks. Start by creating one!
            </Typography>
            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{position: 'fixed', bottom: '16px', right: '16px', width: '70px', height: '70px',}}
                onClick={handleCreateClick}
            >
                <AddIcon />
            </Fab>

            <Dialog open={deletingTask !== null} onClose={handleDeleteCancel}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this task?
                    </Typography>
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
        </Grid>
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
export default TaskList;
