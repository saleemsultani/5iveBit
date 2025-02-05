import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

// this component provides authentication context which wraps the entire app
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: '' });

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        // call checkAuth for user authentication (i.e login);
        const data = await window.api.checkAuth();
        // parse user data
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
