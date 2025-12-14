import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const baseApiUrl = 'https://localhost:7181/api';
const avatarPlaceholder = 'https://localhost:7181/uploads/1920x1080.png'; // Заглушка для аватара

const UserProfile = () => {
  const { user, login } = useAuth();
  const [ reviews, setReviews ] = useState([]);

  
  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${baseApiUrl}/reviews/myreviews`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      setReviews(Array.isArray(response.data) ? response.data : []);
    };

    fetchReviews();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Разрешены только JPG и PNG');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${baseApiUrl}/auth/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Обновляем аватар в контексте
      const updatedUser = { ...user, avatarUrl: response.data.avatarUrl };
      login(updatedUser, token);
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Ошибка загрузки аватара');
    }
  };

  if (!user) {
    return <div className="container mt-5">Загрузка...</div>;
  }


  return (
    <div className="container mt-4">
      <h1>Личный кабинет</h1>

      {/* Основной контейнер с двумя колонками */}
      <div className="row">
        {/* Левая колонка - профиль и аватар */}
        <div className="col-lg-4 col-md-5 mb-4">
          <div className="card">
            <div className="card-body text-center">
              {/* Аватар */}
              <img
                src={user.avatarUrl ? `https://localhost:7181${user.avatarUrl}` : avatarPlaceholder}
                alt="Аватар"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={(e) => e.currentTarget.src = avatarPlaceholder}
              />

              {/* Кнопка загрузки аватара */}
              <div className="mb-3">
                <label className="btn btn-outline-primary mb-0">
                  Загрузить аватар
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div>
                <Link to="/profile/reviews" className="text-decoration-none">
                  Мои отзывы ({reviews.length})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - данные пользователя */}
        <div className="col-lg-8 col-md-7">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Данные пользователя</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Имя пользователя</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.userName}
                  readOnly
                />
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-danger"
                  onClick={() => alert('Удаление аккаунта пока не реализовано')}
                >
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;