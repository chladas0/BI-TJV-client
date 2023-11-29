import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Toolbar, AppBar, Box, Typography, Button } from "@mui/material";

const Navbar = ({user}) => {
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    const handleLogin = () => {
        window.location.href = "/login";
    }
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <RouterLink to="/user-projects">
                            <Typography
                                variant="h6"
                                component="div"
                                color="white"
                                mr={10}
                            >
                                {user.username ? `Projects - ${user.username}` : ""}
                            </Typography>
                        </RouterLink>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>

                        <Button
                            variant="outlined"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Optional: Change hover style
                                }
                            }}
                            onClick={user.username ? handleLogout : handleLogin }
                        >
                            {user.username ? "Logout" : "Login" }
                        </Button>

                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Navbar;
