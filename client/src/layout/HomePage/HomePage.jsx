import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const baseApiUrl = "https://localhost:7181/api";

const HomePage = () => {
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

    const placeholderImageUrl = "https://localhost:7181/uploads/1920x1080.png";

    return (
        <div className="container-fluid mt-2">
            <h1>Фильмы</h1>
            <div className="row row-cols-3">
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
                                    <Link to={`/films/${film.id}`} className="btn btn-light">
                                        Подробнее
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HomePage;