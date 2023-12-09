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
    ListItemText, Box,
} from '@mui/material';
import {useNavigate, useParams} from "react-router-dom";


const fetchProject = async (projectId) => {
    try {
        const response = await axios.get(`http://localhost:8080/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

const fetchAllUsers = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const UpdateProject = ({ userId }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const { projectId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
            const fetchAndSetProjects = async () => {
                try {
                    const updatingProject = await fetchProject(projectId);
                    setNewProjectName(updatingProject.name);
                    setNewProjectDescription(updatingProject.description);
                    setSelectedUsers(updatingProject.contributorsIds);
                    const users = await fetchAllUsers();
                    setAllUsers(users);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            };
            fetchAndSetProjects();
    }, [userId, projectId]);

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

    const handleEditCancel = () => {
        navigate("/");
    };

    const handleUserSelection = (user) => {
        if (selectedUsers.includes(user.id)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user.id]);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:8080/projects/${projectId}`,
                {
                    name: newProjectName,
                    contributorsIds: selectedUsers,
                    description: newProjectDescription,
                }
            );
            if (response.status === 200) {
                navigate("/");
            } else {
                console.log(response);
                alert('Project update failed');
            }
        } catch (error) {
            console.error('Error during project update:', error);
            alert('Error during project update');
        }
    };

    return(
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>

            <form onSubmit={handleEditSubmit}>
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
                    fullWidth
                    value={(() => {
                        const contributorNames = selectedUsers.map((userId) => {
                            const user = allUsers.find((u) => u.id === userId);
                            return user ? user.username : 'Unknown User';
                        });
                        return contributorNames.join(', ');
                    })()}
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

                <Box mt={2}>
                    <Button onClick={handleEditCancel} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: 2 }}>
                        Update Project
                    </Button>
                </Box>
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
};

export default UpdateProject;
