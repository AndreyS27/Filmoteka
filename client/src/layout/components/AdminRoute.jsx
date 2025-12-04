import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/login" />
    }

    const isAdmin = user.roles?.includes('Admin');
    if (!isAdmin) {
        return <Navigate to="/profile" />;
    }

    return children;
};

export default AdminRoute;