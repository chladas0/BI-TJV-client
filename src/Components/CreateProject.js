import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {useNavigate} from "react-router-dom";

const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const CreateProject = ({ userId }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectContributors, setNewProjectContributors] = useState([]);
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (openUserDialog) {
            (async () => {
                const users = await fetchAllUsers();
                setAllUsers(users);
            })();
        }
    }, [openUserDialog]);

    const handleContributorsClick = () => {
        setOpenUserDialog(true);
    };

    const handleUserDialogClose = () => {
        setOpenUserDialog(false);
    };

    const handleUserSelection = (user) => {
        if (selectedUsers.includes(user.id)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user.id]);
        }
    };

    const handleCreateProjectClose = () => {
        navigate("/");
    }

    const handleCreateProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:8080/users/${userId}/projects`,
                {
                    name: newProjectName,
                    contributorsIds: newProjectContributors,
                    description: newProjectDescription,
                }
            );
            navigate("/");
        }
        catch (error) {
            console.error('Error during project creation:', error);
            alert('Error during project creation');
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <form onSubmit={handleCreateProjectSubmit}>
                <TextField
                    label="Project Name"
                    autoComplete="off"
                    fullWidth
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Contributors"
                    autoComplete="off"
                    fullWidth
                    value={selectedUsers.map((userId) => userId.toString()).join(', ')}
                    onClick={handleContributorsClick}
                    margin="normal"
                    readOnly
                />
                <TextField
                    label="Description"
                    autoComplete="off"
                    fullWidth
                    multiline
                    rows={4}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                    Create Project
                </Button>

                <Button
                    onClick={handleCreateProjectClose}
                    variant="contained"
                    color="secondary"
                >
                    Cancel
                </Button>
            </form>



            <Dialog open={openUserDialog} onClose={handleUserDialogClose}>
                <DialogTitle>Select Contributors</DialogTitle>

                <DialogContent>
                    <List>
                        {allUsers.map((user) => (
                            <ListItem key={user.id} onClick={() => handleUserSelection(user)}>
                                <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserSelection(user)}
                                />
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleUserDialogClose} color="primary">
                        Done
                    </Button>
                </DialogActions>

            </Dialog>
        </Container>
    )
}

export default CreateProject;
