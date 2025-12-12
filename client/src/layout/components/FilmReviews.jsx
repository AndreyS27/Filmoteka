import { useEffect, useState } from 'react';
import axios from 'axios';

const baseApiUrl = 'https://localhost:7181/api';
const avatarPlaceholder = 'https://localhost:7181/uploads/1920x1080.png';

const FilmReviews = ({ filmId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${baseApiUrl}/reviews/films/${filmId}`)
                setReviews(response.data);
            } catch (err) {
                setError('Не удалось загрузить отзывы');
                console.error('Reviews fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [filmId]); 

    if (loading) {
        return <p>Загрузка отзывов...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (reviews.length === 0) {
        return <p>Отзывов пока нет. Будьте первым!</p>;
    }

    return (
        <div className="mt-3">
            {reviews.map((review) => (
                <div key={review.id} className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                            <img
                                src={review.author.avatarUrl
                                    ? `${baseApiUrl}${review.author.avatarUrl}`
                                    : avatarPlaceholder}
                                className="rounded-circle"
                                alt={review.author.userName}
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                onError={(e) => e.currentTarget.src = avatarPlaceholder}
                            />
                        </div>
                        <div className="col-md-10">
                            <div className="card-body">
                                <h6 className="card-title mb-1">
                                    {review.author.userName}
                                    <small className="text-body-secondary ms-2">
                                        {review.rating}/10
                                    </small>
                                </h6>
                                <h5>{review.title}</h5>
                                <p className="card-text">{review.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilmReviews;