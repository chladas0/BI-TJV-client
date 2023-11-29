import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Toolbar, AppBar, Box, Typography, Button, Stack } from "@mui/material";

const Navbar = ({ user }) => {
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

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
                        <RouterLink to="/">
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
                        {user.username ? (
                            <Button
                                variant="outlined"
                                sx={{
                                    color: "white",
                                    borderColor: "white",
                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    },
                                }}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Stack direction="row" spacing={2}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="outlined"
                                    sx={{
                                        color: "white",
                                        borderColor: "white",
                                        "&:hover": {
                                            borderColor: "white",
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="outlined"
                                    sx={{
                                        color: "white",
                                        borderColor: "white",
                                        "&:hover": {
                                            borderColor: "white",
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        },
                                    }}
                                >
                                    Register
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Navbar;
