import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseApiUrl = "https://localhost:7181/api";

const RegistrationPage = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${baseApiUrl}/auth/register`, {
                username,
                email,
                password
            });

            const { token, id, userName } = response.data;

            login({ id, username: userName }, token);

            navigate("/")
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data?.message || "Имя пользователя или почта уже существуеют";
                setError(errorMessage);
            } else if (error.request) {
                setError("Не удалось подключиться к серверу");
            } else {
                setError("Произошла ошибка при отправке запроса");
            }
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div className="col-12 col-md-6 col-lg-4">

                    <form className="p-4 border rounded mt-5" onSubmit={handleSubmit}>
                        <h3 className="text-center mb-4">Регистрация</h3>
                        <div className="mb-3">
                            <label htmlFor="exampleInputUsername" className="form-label">Имя пользователя</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                                id="exampleInputUsername"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Почта</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                id="exampleInputEmail1"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                id="exampleInputPassword1"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-primary w-100"
                        >
                            {loading ? "Регистрация..." : "Зарегистрироваться"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;