import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* <div className="navbar-nav">
                            <Link to="/" className="nav-link">Главная</Link>
                            <Link to="/about" className="nav-link">О проекте</Link>
                            {user ? (
                                <>
                                    <Link to="/profile"
                                        className="nav-link">
                                        Личный кабинет
                                    </Link>
                                    <button onClick={handleLogout} className="nav-link">Выйти</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link">Войти/Зарегистрироваться</Link>
                                </>
                            )}
                        </div> */}
                    <div className="navbar-nav me-auto"> {/* Левая часть */}
                        <Link to="/" className="nav-link">Главная</Link>
                        <Link to="/about" className="nav-link">О проекте</Link>
                    </div>

                    <div className="navbar-nav"> {/* Правая часть */}
                        {user ? (
                            <>
                                <Link to="/profile" className="nav-link">Личный кабинет</Link>
                                <button
                                    onClick={handleLogout}
                                    className="nav-link border-0 bg-transparent"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="nav-link">Войти/Зарегистрироваться</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;