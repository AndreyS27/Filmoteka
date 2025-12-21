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
    const { user } = useAuth();

    const [reviewForm, setReviewForm] = useState({
        title: '',
        text: ''
    });
    const [rating, setRating] = useState(5);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

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

    const placeholderImageUrl = "/1920x1080.png";

    const posterUrl = film.posterPath
        ? `https://localhost:7181/${film.posterPath}`
        : placeholderImageUrl;

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewForm.title.trim() || !reviewForm.text.trim()) {
            setReviewError('Заголовок и текст отзыва обязательны');
            return;
        }

        if (!user) {
            setReviewError('Для написания рецензии авторизуйтесь!');
            return;
        }

        setReviewLoading(true);
        setReviewError('');

        try {
            const token = localStorage.getItem('authToken');
            const reviewDto = {
                title: reviewForm.title,
                text: reviewForm.text,
                rating: rating
            };

            await axios.post(`${baseApiUrl}/reviews/films/${id}`, reviewDto, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviewForm({ title: '', text: '' });
            setRating(5);

        } catch (err) {
            console.error('Review submit error:', err);
            setReviewError('Ошибка при добавлении отзыва');
        } finally {
            setReviewLoading(false);
        }
    };


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

            <form className="container col-md-6 mt-5 mb-3" onSubmit={handleSubmit}>
                <h4>Написать рецензию</h4>

                {reviewError && (
                    <div className="alert alert-danger">{reviewError}</div>
                )}

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={reviewForm.title}
                        onChange={handleFormChange}
                        required
                        placeholder="Заголовок"
                    >
                    </input>
                </div>

                <div className="mb-3">
                    <textarea
                        className="form-control"
                        name="text"
                        value={reviewForm.text}
                        onChange={handleFormChange}
                        rows="3"
                        placeholder="Текст"
                        required>
                    </textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="range3" className="form-label">Оценка: {rating}/10</label>
                    <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="10"
                        step="1"
                        value={rating}
                        id="ratingRange"
                        onChange={(e) => setRating(Number(e.target.value))}>
                    </input>
                </div>

                <div className="text-center">
                    <button 
                        type="submit" 
                        className="btn btn-outline-dark"
                        disabled={reviewLoading}
                    >
                        {reviewLoading ? 'Отправка' : 'Опубликовать рецензию'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FilmDetailsPage;