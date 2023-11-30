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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    DialogContentText, Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const ProjectStates = {
    VIEW: 'view',
    CREATE: 'create',
    DELETE: 'delete',
    UPDATE: 'update'
};

const fetchProjects = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/users/${userId}/projects`);
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

const ProjectsPage = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectContributors, setNewProjectContributors] = useState([]);
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [projectState, setProjectState] = useState(ProjectStates.VIEW);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [deletingProject, setDeletingProject] = useState(null);
    const [updatingProject, setUpdatingProject] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId && projectState !== ProjectStates.CREATE) {
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
            fetchAndSetProjects();
        }
    }, [userId, projectState]);

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

    const resetNewProject = () =>
    {
        setNewProjectName('');
        setNewProjectContributors([]);
        setNewProjectDescription('');
    }

    const handleUserSelection = (user) => {
        if (selectedUsers.includes(user.id)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
        } else {
           setSelectedUsers([...selectedUsers, user.id]);
        }
        setNewProjectContributors(selectedUsers);
    };

    const handleCreateProjectClick = () => {
        setProjectState(ProjectStates.CREATE);
    };

    const handleCreateProjectClose = () => {
        setProjectState(ProjectStates.VIEW)
        resetNewProject();
        setSelectedUsers([]);
    }

    const handleCreateProjectSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:8080/users/${userId}/projects`,
                {
                    name: newProjectName,
                    contributorsIds: newProjectContributors,
                    description: newProjectDescription,
                }
            );

            if (response.status === 200) {
                const updatedProjects = await fetchProjects(userId);
                setProjects(updatedProjects);
            } else {
                console.log(response);
                alert('Project creation failed');
            }
        } catch (error) {
            console.error('Error during project creation:', error);
            alert('Error during project creation');
        } finally {
            setProjectState(ProjectStates.VIEW);
            resetNewProject();
        }
    };

    const handleDeleteClick = (projectId) => {
        setProjectState(ProjectStates.DELETE);
        setDeletingProject(projectId);
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
            setProjectState(ProjectStates.VIEW);
            setDeletingProject(null);
        }
    };

    const handleDeleteCancel = () => {
        setProjectState(ProjectStates.VIEW);
        setDeletingProject(null);
    };

    const handleEditClick = (projectId) => {
        setProjectState(ProjectStates.UPDATE);
        setUpdatingProject(projectId);
        const projectData = projects.find((project) => project.id === projectId);
        setNewProjectName(projectData.name);
        setNewProjectContributors(projectData.contributorsIds);
        setNewProjectDescription(projectData.description);
        setSelectedUsers(projectData.contributorsIds);
    };

    const handleEditCancel = () => {
        setProjectState(ProjectStates.VIEW);
        setUpdatingProject(null);
        setSelectedUsers([]);
        resetNewProject();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make API call to update the project
            const response = await axios.put(
                `http://localhost:8080/projects/${updatingProject}`,
                {
                    name: newProjectName,
                    contributorsIds: selectedUsers,
                    description: newProjectDescription,
                }
            );

            if (response.status === 200) {
                // Fetch and set projects after successful update
                const updatedProjects = await fetchProjects(userId);
                setProjects(updatedProjects);
            } else {
                console.log(response);
                alert('Project update failed');
            }
        } catch (error) {
            console.error('Error during project update:', error);
            alert('Error during project update');
        } finally {
            // Reset state and switch back to VIEW state
            setProjectState(ProjectStates.VIEW);
            setUpdatingProject(null);
            setNewProjectName('');
            setNewProjectContributors([]);
            setNewProjectDescription('');
        }
    };

    let content;

    if (!userId) {
        return (
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Typography variant="h6">You must be logged in to view projects.</Typography>
            </Container>
        );
    }

    else if (projectState === ProjectStates.VIEW) {
        content = (
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id} onClick={() => navigate(`/project/${project.id}`)} sx={{
                            '&:hover': {cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', transform: 'scale(1.02)',},}}
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
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{position: 'fixed', bottom: '16px', right: '16px', width: '70px', height: '70px',}}
                    onClick={handleCreateProjectClick}
                >
                    <AddIcon />
                </Fab>
            </Grid>
        );
    } else if (projectState === ProjectStates.CREATE) {
        content = (
            <form onSubmit={handleCreateProjectSubmit}>
                <TextField
                    label="Project Name"
                    fullWidth
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Contributors"
                    fullWidth
                    value={selectedUsers.map((userId) => userId.toString()).join(', ')}
                    onClick={handleContributorsClick}
                    margin="normal"
                    readOnly
                />
                <TextField
                    label="Description"
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
                {/* Display cancel button to go back to VIEW state */}
                <Button
                    onClick={handleCreateProjectClose}
                    variant="contained"
                    color="secondary"
                >
                    Cancel
                </Button>
            </form>
        );
    } else if (projectState === ProjectStates.UPDATE) {

        content = (
            <form onSubmit={handleEditSubmit}>
                <TextField
                    label="Project Name"
                    fullWidth
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Contributors"
                    fullWidth
                    value={selectedUsers.map((userId) => userId.toString()).join(', ')}
                    onClick={handleContributorsClick}
                    margin="normal"
                    readOnly
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                    Update Project
                </Button>
                {/* Display cancel button to go back to VIEW state */}
                <Button onClick={handleEditCancel} variant="contained" color="secondary">
                    Cancel
                </Button>
            </form>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            {content}

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

            <Dialog open={projectState === ProjectStates.DELETE} onClose={handleDeleteCancel}>
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

export default ProjectsPage;
