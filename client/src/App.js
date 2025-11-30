import Header from "./layout/components/Header";
import { AuthProvider } from "./layout/context/AuthContext";
import { Route, Routes,  } from "react-router-dom";
import LoginPage from "./layout/LoginPage/LoginPage";
import HomePage from "./layout/HomePage/HomePage";
import AboutPage from "./layout/AboutPage/AboutPage";
import ProfilePage from "./layout/ProfilePage/ProfilePage";

const App = () => {
  return (
    <AuthProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
    </AuthProvider>
  );
};

export default App;
