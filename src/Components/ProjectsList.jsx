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
    DialogContentText, Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const fetchProjects = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/users/${userId}/projects`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

const ProjectsPage = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [deletingProject, setDeletingProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
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
    }, [userId]);

    const handleCreateProjectClick = () => {
        navigate("/create-project");
    };

    const handleEditClick = (projectId) => {
        navigate(`/update-project/${projectId}`);
    };

    const handleDeleteClick = (projectId) => {
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
            setDeletingProject(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeletingProject(null);
    };

    if (!userId) {
        return (
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Typography variant="h6">You must be logged in to view projects.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}
                          onClick={() => navigate(`/projects/${project.id}`)}
                          sx={{'&:hover': {cursor: 'pointer', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                  transform: 'scale(1.02)',},}}
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

            <Dialog open={deletingProject !== null}  onClose={handleDeleteCancel}>
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
    )
};

export default ProjectsPage;
