import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from '@mui/material';

const Spinner = () => {
  const [count, setCount] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    // set an interval of 1 sec
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    // when counts reach 0 then noavigate to login user page and tehn clear interval
    count === 0 && navigate('/login-user');
    return () => clearInterval(interval);
  }, [count, navigate]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress color="secondary" />
      <Typography variant="h6" mt={2}>
        Redirecting to you in {count} seconds
      </Typography>
    </Box>
  );
};

export default Spinner;
