import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container mt-5">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Проверка для админских маршрутов
  if (adminOnly) {
    const isAdmin = user.roles?.includes('Admin');
    if (!isAdmin) {
      return <Navigate to="/profile" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;