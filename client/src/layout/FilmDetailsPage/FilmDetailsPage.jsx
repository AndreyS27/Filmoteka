import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilmReviews from "../components/FilmReviews";
import { useAuth } from "../context/AuthContext";

const baseApiUrl = "https://localhost:7181/api";

const FilmDetailsPage = () => {
    const { id } = useParams();
    const [film, setFilm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState(5);

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const response = await axios.get(`${baseApiUrl}/films/${id}`);
                setFilm(response.data);
            } catch (err) {
                setError('Не удалось получить информацию о фильме');
                console.error('Film details error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilm();
    }, [id]);

    if (loading) {
        return <div className="container mt-5">Загрузка...</div>;
    }

    if (error) {
        return <div className="container mt-5 text-danger">{error}</div>;
    }

    const placeholderImageUrl = "https://localhost:7181/uploads/1920x1080.png";

    const posterUrl = film.posterPath
        ? `https://localhost:7181/${film.posterPath}`
        : placeholderImageUrl;

    return (
        <div className="container-lg mt-5">
            <div className="row">
                <div className="col-3 mt-5">
                    <img
                        className="img-fluid"
                        src={posterUrl}
                        alt={film?.name || "Постер"}>
                    </img>
                </div>
                <div className="col">
                    <h1>{film.name}</h1>
                    <p>{film.description}</p>
                    <p>{film.year}</p>
                    <p>{film.duration}</p>
                    <p>{film.country}</p>
                    <p>{film.genre}</p>
                    <p>{film.director}</p>
                </div>
            </div>
            <div className="container-lg mt-5">
                <h4>Рецензии зрителей</h4>
                <FilmReviews filmId={id} />
            </div>
            <form className="container col-md-6 mb-3">
                <h4>Написать рецензию</h4>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="reviewHeader"
                        placeholder="Заголовок"
                    >
                    </input>
                </div>
                <div className="mb-3">
                    <textarea 
                        className="form-control" 
                        id="exampleFormControlTextarea1" 
                        rows="3"
                        placeholder="Текст">
                    </textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="range3" className="form-label">Оценка</label>
                    <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        id="range3"
                        onChange={(e) => setValue(e.target.value)}>
                    </input>
                    <output htmlFor="range3" id="rangeValue" aria-hidden="true">
                        {value}
                    </output>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-outline-dark">Опубликовать рецензию</button>
                </div>
            </form>
        </div>
    );
};

export default FilmDetailsPage;