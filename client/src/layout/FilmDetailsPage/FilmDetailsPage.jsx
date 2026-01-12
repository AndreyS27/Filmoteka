import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilmReviews from "../components/FilmReviews";
import { useAuth } from "../context/AuthContext";

const baseApiUrl = process.env.REACT_APP_API_URL;

const FilmDetailsPage = () => {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]); // Состояние для отзывов

    const [reviewForm, setReviewForm] = useState({
        title: '',
        text: ''
    });
    const [rating, setRating] = useState(5);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // Загрузка фильма
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

    // Загрузка существующих отзывов
    useEffect(() => {
        const fetchInitialReviews = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${baseApiUrl}/reviews/films/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error loading initial reviews:', error);
            }
        };
        fetchInitialReviews();
    }, [id]);

    if (loading) {
        return <div className="container mt-5">Загрузка...</div>;
    }

    if (error) {
        return <div className="container mt-5 text-danger">{error}</div>;
    }

    const placeholderImageUrl = "/1920x1080.png";
    const posterUrl = film.posterPath
        ? `http://localhost:7181${film.posterPath}`
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

            const response = await axios.post(`${baseApiUrl}/reviews/films/${id}`, reviewDto, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Добавляем новый отзыв в состояние
            const newReview = {
                id: response.data.id,
                title: reviewDto.title,
                text: reviewDto.text,
                rating: reviewDto.rating,
                author: {
                    userName: user.userName,
                    avatarUrl: user.avatarUrl
                }
            };
            setReviews(prev => [newReview, ...prev]);

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
                        alt={film?.name || "Постер"}
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                </div>
                <div className="col mt-5">
                    <h1>{film.name}</h1>
                    <p>{film.description}</p>
                    <div className="row">
                        <div className="col-6">
                            <p><strong>Год:</strong> {film.year}</p>
                            <p><strong>Длительность:</strong> {film.duration}</p>
                            <p><strong>Страна:</strong> {film.country}</p>
                        </div>
                        <div className="col-6">
                            <p><strong>Жанр:</strong> {film.genre}</p>
                            <p><strong>Режиссёр:</strong> {film.director}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-lg mt-5">
                <h4>Рецензии зрителей</h4>
                <FilmReviews reviews={reviews} />
            </div>

            {user && (
                <form className="container col-md-6 mt-5 mb-3" onSubmit={handleSubmit}>
                    <h4>Написать рецензию</h4>
                    {reviewError && <div className="alert alert-danger">{reviewError}</div>}

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={reviewForm.title}
                            onChange={handleFormChange}
                            required
                            placeholder="Заголовок"
                        />
                    </div>

                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            name="text"
                            value={reviewForm.text}
                            onChange={handleFormChange}
                            rows="3"
                            placeholder="Текст"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="ratingRange" className="form-label">Оценка: {rating}/10</label>
                        <input
                            type="range"
                            className="form-range"
                            min="1"
                            max="10"
                            step="1"
                            value={rating}
                            id="ratingRange"
                            onChange={(e) => setRating(Number(e.target.value))}
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-outline-dark"
                            disabled={reviewLoading}
                        >
                            {reviewLoading ? 'Отправка...' : 'Опубликовать рецензию'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default FilmDetailsPage;