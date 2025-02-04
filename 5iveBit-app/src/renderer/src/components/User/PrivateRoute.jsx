import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { Outlet } from 'react-router-dom';
import Spinner from './Spinner';

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await window.api.checkAuth();
      if (res.success) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
