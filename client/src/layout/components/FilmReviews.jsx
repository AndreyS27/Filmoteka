const avatarPlaceholder = '/1920x1080.png';

const FilmReviews = ({ reviews }) => {
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
                                    ? `http://localhost:7181${review.author.avatarUrl}`
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