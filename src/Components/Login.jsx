import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const LoginPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const responseUsers = await axios.get(
            `http://localhost:8080/users`
        );

        const users = responseUsers.data;
        const findUser = users.find((user) => user.username === username);
        if (findUser) {
            props.setUser(findUser);
            localStorage.setItem("user", JSON.stringify(findUser));
            window.location.href = "/";
        } else {
            alert("User not found");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    autoComplete="off"
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
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default LoginPage
