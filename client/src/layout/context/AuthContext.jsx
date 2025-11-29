import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // сделать запрос к API чтобы получить данные пользователя
            // заглушка
            setUser({id:1, username:'John Doe'});
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default useAuth;