import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Snackbar, Alert } from '@mui/material';
import styles from './LoginUser.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const StyledInput = ({ label, name, value, onChange, type = 'text' }) => (
  <TextField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    fullWidth
    required
    InputProps={{ style: { color: 'white' } }}
    InputLabelProps={{ style: { color: 'white' } }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'white' },
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' }
      }
    }}
  />
);

const LoginUser = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [soverity, setSoverity] = useState('info');
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await window.api.loginUser({
        email,
        password
      });
      console.log('res inside login: ', res);
      if (res.success) {
        const parsedUser = JSON.parse(res.user);
        setAuth({
          ...auth,
          user: parsedUser,
          token: res.token
        });
        setSnackbarOpen(true);
        setSnackbarMessage(res.message);
        setSoverity('success');
        navigate('/dashboard');
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage(res.message);
        setSoverity('error');
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage('something went wrong');
      setSoverity('error');
      console.log(error);
    }
  };

  return (
    <>
      <Box className={styles.container}>
        <Paper className={styles.formContainer} elevation={3}>
          <Typography variant="h4" className={styles.title}>
            Login
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '40%' }}>
            <Box className={styles.inputGroup}>
              <StyledInput
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <StyledInput
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </Box>

            <Box className={styles.buttonGroup}>
              <Button type="submit" variant="contained" className={styles.button}>
                Log in
              </Button>
              <Button
                variant="contained"
                className={styles.button}
                onClick={() => navigate('/dashboard')}
              >
                back
              </Button>
              <NavLink to="/register-user" className={styles.navLink}>
                New here? Sign up
              </NavLink>
            </Box>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={soverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginUser;
