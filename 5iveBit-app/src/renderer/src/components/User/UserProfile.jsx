import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserProfile.module.css';
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  ButtonGroup,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/authContext';
import { useChats } from '../../contexts/ChatContext';

const inpputBorderStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'white' },
    '&:hover fieldset': { borderColor: 'white' },
    '&.Mui-focused fieldset': { borderColor: 'white' }
  }
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const { setChats, setcurrentChat } = useChats();
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // show
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [soverity, setSoverity] = useState('info');

  const handleTogglePassword = (type) => {
    if (type === 'current') setShowPassword(!showPassword);
    if (type === 'new') setShowNewPassword(!showNewPassword);
    if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  async function deleteAccount() {
    const popUpResponse = await window.api.askUserPopup({
      type: 'warning',
      title: 'Delete Account',
      message: `Are you sure you want to delete your account?\nYou will no longer have access to your chat History!`,
      buttons: ['Cancel', 'Delete']
    });

    if (popUpResponse === 'Delete') {
      console.log('Deleteing account...');
      const res = await window.api.deleteUser();
      console.log(res);
      if (res.success) {
        console.log('afte set auth');
        navigate('/dashboard');
        console.log('afte navigating');
        setAuth({ ...auth, user: null });
      }
    } else {
      // do nothing if dellete is not selected
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Trim inputs to avoid accidental spaces
    const trimmedCurrPassword = currPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmNewPassword.trim();

    // Ensure current password is provided
    if (!trimmedCurrPassword) {
      setSnackbarOpen(true);
      setSoverity('error');
      setSnackbarMessage('Current password is required to change password.');
      return;
    }

    // Ensure new and confirm passwords are provided
    if (!trimmedNewPassword || !trimmedConfirmPassword) {
      setSnackbarOpen(true);
      setSoverity('error');
      setSnackbarMessage('New password and confirmation are required.');
      return;
    }

    // Ensure new passwords match
    if (trimmedNewPassword !== trimmedConfirmPassword) {
      setSnackbarMessage('New passwords do not match.');
      setSnackbarOpen(true);
      setSoverity('error');
      return;
    }

    // Prepare the payload for the API request
    const userData = {
      currentPassword: trimmedCurrPassword,
      newPassword: trimmedNewPassword,
      email: auth?.user?.email
    };
    // Make the API request to update the password
    try {
      const res = await window.api.updatePassword(userData);
      console.log('this is res inside userProfile');
      console.log(res);
      if (res.success) {
        setSnackbarOpen(true);
        setSoverity('success');
        setSnackbarMessage(res?.message);
        // Clear the form fields
        setCurrPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setSnackbarOpen(true);
        setSoverity('error');
        setSnackbarMessage(res?.message);
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSoverity('error');
      setSnackbarMessage('Failed to update password');
      console.error(error);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Typography variant="h5" className={styles.title}>
        Profile
      </Typography>

      <TextField
        label="Name"
        fullWidth
        variant="outlined"
        margin="normal"
        className={styles.textField}
        value={`${auth?.user?.firstName} ${auth?.user?.lastName}`}
        sx={inpputBorderStyle}
        InputProps={{ style: { color: 'white' } }}
      />
      <TextField
        label="Email"
        fullWidth
        variant="outlined"
        margin="normal"
        value={auth?.user?.email}
        className={styles.textField}
        sx={inpputBorderStyle}
        InputProps={{ style: { color: 'white' } }}
      />

      <Typography variant="h6" className={styles.passwordTitle}>
        Password
      </Typography>

      <TextField
        label="Current Password"
        fullWidth
        variant="outlined"
        margin="normal"
        value={currPassword}
        onChange={(e) => setCurrPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        sx={inpputBorderStyle}
        className={styles.textField}
        InputProps={{
          style: { color: 'white' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton sx={{ color: 'white' }} onClick={() => handleTogglePassword('current')}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        label="New Password"
        fullWidth
        variant="outlined"
        margin="normal"
        type={showNewPassword ? 'text' : 'password'}
        className={styles.textField}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={inpputBorderStyle}
        InputProps={{
          style: { color: 'white' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton sx={{ color: 'white' }} onClick={() => handleTogglePassword('new')}>
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        label="Confirm New Password"
        fullWidth
        variant="outlined"
        margin="normal"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        type={showConfirmPassword ? 'text' : 'password'}
        className={styles.textField}
        sx={inpputBorderStyle}
        InputProps={{
          style: { color: 'white' },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton sx={{ color: 'white' }} onClick={() => handleTogglePassword('confirm')}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <ButtonGroup className={styles.buttonGroup}>
        <Button type="submit" variant="contained" className={styles.button}>
          update
        </Button>
        <Button
          variant="contained"
          className={styles.button}
          onClick={() => navigate('/dashboard')}
        >
          Back
        </Button>
      </ButtonGroup>
      {/* log out and delete buttons */}
      <ButtonGroup className={styles.logoutDeleteButtonsContainer}>
        <Button
          variant="contained"
          className={styles.logOutButton}
          onClick={async () => {
            try {
              console.log('logging out...');
              const res = await window.api.logoutUser();
              if (res.success) {
                setAuth({
                  user: null,
                  token: ''
                });
                navigate('/dashboard');
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Log out
        </Button>

        <Button variant="contained" className={styles.deleteAccountButton} onClick={deleteAccount}>
          Delete Account
        </Button>
      </ButtonGroup>
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
    </form>
  );
};

export default UserProfile;
