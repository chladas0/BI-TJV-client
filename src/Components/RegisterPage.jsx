import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const responseUsers = await axios.get(
                `http://localhost:8080/users`
            );
            const users = responseUsers.data;
            const findUser = users.find((user) => user.username === username);
            if (findUser) {
                alert('Username must be unique');
            } else {
                const response = await axios.post('http://localhost:8080/users', {
                    username,
                    password
                });
                localStorage.setItem("user", JSON.stringify(response.data));
                window.location.href = "/";
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default RegisterPage;
