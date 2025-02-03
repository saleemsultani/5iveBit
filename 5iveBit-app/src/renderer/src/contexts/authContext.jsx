import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: '' });

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const data = await window.api.checkAuth(); // Ensure this function is async
        const parsedUser = JSON.parse(data.user);
        if (data) {
          setAuth({ user: parsedUser, token: data.token });
        }
      } catch (error) {
        console.error('Error fetching auth:', error);
      }
    };
    fetchAuth();
  }, []);

  return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
};

// Custom hook
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
