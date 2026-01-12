// src/pages/UserReviews.jsx

import axios from "axios";
import { useEffect, useState } from "react";

const baseApiUrl = process.env.REACT_APP_API_URL;

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${baseApiUrl}/reviews/myreviews`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Добавляем флаг isEditing в каждую карточку
        setReviews(response.data.map(review => ({ ...review, isEditing: false })));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Обработчик удаления
  const handleDelete = async (reviewId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${baseApiUrl}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Удаляем из состояния
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Ошибка при удалении отзыва');
    }
  };

  // Включаем режим редактирования
  const handleEdit = (reviewId) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId ? { ...review, isEditing: true } : review
      )
    );
  };

  // Сохраняем изменения
  const handleSave = async (reviewId, updatedData) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${baseApiUrl}/reviews/${reviewId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Обновляем в состоянии
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, ...updatedData, isEditing: false }
            : review
        )
      );
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Ошибка при сохранении отзыва');
    }
  };

  // Отменяем редактирование
  const handleCancel = (reviewId) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId ? { ...review, isEditing: false } : review
      )
    );
  };

  if (loading) {
    return <div className="container mt-5">Загрузка...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Мои рецензии</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
        {reviews.map((review) => (
          <div key={review.id} className="col">
            <div className="card h-100">
              <div className="card-body">
                {review.isEditing ? (
                  // Режим редактирования
                  <>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={review.title}
                        onChange={(e) => {
                          setReviews(prev => 
                            prev.map(r => 
                              r.id === review.id ? { ...r, title: e.target.value } : r
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="3"
                        value={review.text}
                        onChange={(e) => {
                          setReviews(prev => 
                            prev.map(r => 
                              r.id === review.id ? { ...r, text: e.target.value } : r
                            )
                          );
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Оценка: {review.rating}</label>
                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="10"
                        value={review.rating}
                        onChange={(e) => {
                          setReviews(prev => 
                            prev.map(r => 
                              r.id === review.id ? { ...r, rating: Number(e.target.value) } : r
                            )
                          );
                        }}
                      />
                    </div>
                  </>
                ) : (
                  // Обычный режим
                  <>
                    <h5 className="card-title">{review.title}</h5>
                    <p className="card-text">{review.text}</p>
                  </>
                )}
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><b>Фильм:</b> "{review.filmName}"</li>
                <li className="list-group-item"><b>Оценка:</b> {review.rating}</li>
              </ul>
              <div className="card-body">
                {review.isEditing ? (
                  // Кнопки в режиме редактирования
                  <>
                    <button 
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleSave(review.id, {
                        title: review.title,
                        text: review.text,
                        rating: review.rating
                      })}
                    >
                      Сохранить
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleCancel(review.id)}
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  // Кнопки в обычном режиме
                  <>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(review.id)}
                    >
                      Изменить
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(review.id)}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;