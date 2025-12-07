import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const baseApiUrl = "https://localhost:7181/api";
const placeholderImageUrl = "https://localhost:7181/uploads/1920x.png";

const AdminProfile = () => {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true); // состояние загрузки
    const [error, setError] = useState(null); // состояние ошибки

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const response = await axios.get(`${baseApiUrl}/films`);
                setFilms(response.data);
                console.log("Фильмы получены:", response.data);
            }
            catch (err) {
                console.error("Ошибка запроса фильмов:", err);
                setError(err.message || "Не удалось загрузить фильмы");
            }
            finally {
                setLoading(false);
            }
        };

        fetchFilms();
    }, []);

    if (loading) {
        return (
            <div className="container-fluid mt-5">
                <p>Загрузка фильмов...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container-fluid mt-5">
                <p className="text-danger">Ошибка: {error}</p>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-2">
            <h1>Admin Page</h1>
            <Link to="/admin/films/new" className="btn btn-success mb-4">
                Добавить фильм
            </Link>
            <div className="row row-cols-4">
                {films.length === 0 ? (
                    <p>Список фильмов пуст</p>
                ) : (
                    films.map((film) => {
                        const posterUrl = film.posterPath
                            ? `https://localhost:7181${film.posterPath}`
                            : placeholderImageUrl;

                        return (
                            <div className="col" key={film.id}>
                                <div className="card m-3" >
                                    <img
                                        src={posterUrl}
                                        className="card-img-top"
                                        alt={film.name}
                                        onError={(e) => {
                                            e.currentTarget.src = placeholderImageUrl;
                                        }}>
                                    </img>
                                    <div className="card-body">
                                        <h5 className="card-title">{film.name}</h5>
                                        <p className="card-text">{film.description.slice(0, 50)}...</p>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Длительность {film.duration}</li>
                                        <li className="list-group-item">Год выпуска: {film.year}</li>
                                        <li className="list-group-item">Страна: {film.country}</li>
                                        <li className="list-group-item">Режиссер: {film.director}</li>
                                        <li className="list-group-item">Жанр: {film.genre}</li>
                                    </ul>

                                    <div className="card-body">
                                        <Link
                                            to={`/admin/films/${film.id}/edit`}
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            Изменить
                                        </Link>
                                        <button className="btn btn-sm btn-outline-danger">
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default AdminProfile;
