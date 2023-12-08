import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import axios from 'axios';

const UpdateTask = () => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [creationDate, setCreationDate] = useState('')
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('');

    const navigate = useNavigate();
    const { projectId, taskId } = useParams();

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/task/${taskId}`);
                const taskData = response.data;
                setTaskName(taskData.taskName);
                setDescription(taskData.description);
                setCreationDate(taskData.creationDate);
                setDueDate(formatDate(taskData.dueDate));
                setStatus(taskData.status);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTaskData();
    }, [projectId, taskId]);

    const handleUpdateTask = async () => {
        try {
            await axios.put(`http://localhost:8080/task/${taskId}`, {
                taskName,
                description,
                creationDate,
                dueDate: new Date(dueDate).toISOString().slice(0, 16),
                status,
            });
            navigate(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Update Task
            </Typography>
            <Box>

                <TextField
                    label="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Due Date"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ marginBottom: '16px' }}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                        <MenuItem value="TODO">TODO</MenuItem>
                        <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                        <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box mt={2}>
                <Button onClick={() => navigate(`/projects/${projectId}`)} color="primary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleUpdateTask} color="primary" variant="contained" sx={{ marginLeft: 2 }}>
                    Update
                </Button>
            </Box>

        </Container>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default UpdateTask;
