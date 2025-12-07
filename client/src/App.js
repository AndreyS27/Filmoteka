import Header from "./layout/Header/Header";
import { AuthProvider } from "./layout/context/AuthContext";
import { Route, Routes, } from "react-router-dom";
import LoginPage from "./layout/LoginPage/LoginPage";
import HomePage from "./layout/HomePage/HomePage";
import AboutPage from "./layout/AboutPage/AboutPage";
import RegistrationPage from "./layout/RegistrationPage/RegistrationPage";
import AdminRoute from "./layout/components/AdminRoute";
import AdminProfile from "./layout/AdminProfile/AdminProfile";
import ProtectedRoute from "./layout/components/ProtectedRoute";
import UserProfile from "./layout/UserProfile/UserProfile";
import FilmDetailsPage from "./layout/FilmDetailsPage/FilmDetailsPage";
import AddFilmPage from "./layout/AddFilmPage/AddFilmPage";
import EditFilmPage from "./layout/EditFilmPage/EditFilmPage";

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/admin/films/new" element={<AddFilmPage />} />
          <Route path="/admin/films/:id/edit" element={<EditFilmPage />} />
          <Route path="/films/:id" element={<FilmDetailsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
