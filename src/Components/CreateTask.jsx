import React, { useState } from 'react';
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

const CreateTask = () => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('TODO');

    const navigate = useNavigate();
    const { projectId } = useParams();

    const handleCreateTask = async () => {
        try {
            await axios.post(`http://localhost:8080/projects/${projectId}/tasks`, {
                taskName,
                description,
                creationDate: new Date().toISOString(),
                dueDate: new Date(dueDate).toISOString().slice(0, 16),
                status,
            });
            navigate(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Error creating task');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Create Task
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
                    InputLabelProps={{shrink: true,}}
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
                <Button onClick={handleCreateTask} color="primary" variant="contained" sx={{ marginLeft: 2 }}>
                    Create
                </Button>
            </Box>

        </Container>
    );
};

export default CreateTask;
