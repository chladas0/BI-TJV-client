import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Container, Box, CircularProgress, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const fetchProjects = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/users/${userId}/projects`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

const ProjectsPage = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            (async () => {
                setLoading(true);
                const fetchedProjects = await fetchProjects(userId);
                if (fetchedProjects) {
                    setProjects(fetchedProjects);
                }
                setLoading(false);
            })();
        }
    }, [userId]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 20 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!userId) {
        return (
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Typography variant="h6">You must be logged in to view projects.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            {projects.length > 0 ? (
                <Grid container spacing={3}>
                    {projects.map(project => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <Card>
                                <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h5" component="h2">
                                        {project.name}
                                    </Typography>
                                    <IconButton aria-label="delete" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    <Button variant="contained" color="success" sx={{ mt: '20px' }}>
                        Create Project
                    </Button>
                </Grid>
            ) : (
                <>
                    <Typography variant="h6">You don't have any projects. Start by creating one!</Typography>
                    <Button variant="contained" color="success" sx={{ mt: '20px' }}>
                        Create Project
                    </Button>
                </>
            )}
        </Container>
    );
};

export default ProjectsPage;
