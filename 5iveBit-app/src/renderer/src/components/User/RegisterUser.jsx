import { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import styles from './RegisterUser.module.css';
import { NavLink, useNavigate } from 'react-router-dom';

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

const RegisterUser = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [soverity, setSoverity] = useState('info');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await window.api.registerUser(
        JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          subscribe
        })
      );

      if (res.success) {
        setSnackbarOpen(true);
        setSnackbarMessage(res.message);
        setSoverity('success');
        navigate('/login-user');
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage(res.message);
        setSoverity('error');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage('something went wrong');
      setSoverity('error');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      console.log(error);
    }
  };

  return (
    <Box className={styles.container}>
      <Paper className={styles.formContainer} elevation={3}>
        <Typography variant="h4" className={styles.title}>
          Create an account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box className={styles.inputGroupName}>
            <StyledInput
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <StyledInput
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
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
          <FormControlLabel
            control={
              <Checkbox
                name="subscribe"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                sx={{
                  color: 'white', // Unchecked color
                  '&.Mui-checked': { color: 'white' } // Checked color
                }}
              />
            }
            label="Subscribe to our newsletter"
            className={styles.checkbox}
          />
          <Box className={styles.buttonGroup}>
            <Button type="submit" variant="contained" className={styles.button}>
              Sign Up
            </Button>
            <Button
              variant="contained"
              className={styles.button}
              onClick={() => navigate('/dashboard')}
            >
              cancel
            </Button>
            <NavLink to="/login-user" className={styles.navLink}>
              have an account? Login
            </NavLink>
          </Box>
        </form>
      </Paper>
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
    </Box>
  );
};

export default RegisterUser;
