import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const baseApiUrl = 'https://localhost:7181/api';
const avatarPlaceholder = '/1920x1080.png'; // Заглушка для аватара

const UserProfile = () => {
  const { user, login, logout, loading } = useAuth();
  const [ reviews, setReviews ] = useState([]);
  const navigate = useNavigate();

  // Состояние для режима редактирования username
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.userName || '');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  
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

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      setUsernameError('Имя пользователя не может быть пустым');
      return;
    }

    if (newUsername === user.userName) {
      setIsEditingUsername(false);
      return;
    }

    setUsernameLoading(true);
    setUsernameError('');
    setUsernameSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${baseApiUrl}/auth/username`,
        newUsername,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedUser = { ...user, userName: response.data.userName};
      login(updatedUser, token);

      setUsernameSuccess(true);
      setIsEditingUsername(false);
    } catch (error) {
      console.error('Username update error:', error);
      setUsernameError(
        error.response?.data?.message ||
        error.response?.data ||
        'Ошибка при изменении имени пользователя'
      );
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleCancelUserName = () => {
    setNewUsername(user.userName);
    setIsEditingUsername(false);
    setUsernameError('');
    setUsernameSuccess(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить!')) return;

    try {
      const token = localStorage.getItem('authToken');
      await await axios.delete(`${baseApiUrl}/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}`}
      });

      logout();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      alert('При удалении аккаунта произошла ошибка');
    }
  };

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

  const handleDeleteAvatar = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${baseApiUrl}/auth/avatar`, {
        headers: { Authorization: `Bearer ${token} `}
      });

      const updatedUser = { ...user, avatarUrl: ''};
      login(updatedUser, token);
    } catch (error) {
      console.error('Delete avatar error:', error);
    }
  };

  if (loading) {
    return <div className="container mt-5">Загрузка...</div>;
  }

  if (!user) {
    return <div className="container mt-5">Загрузка...</div>;
  }


  return (
    <div className="container mt-4">
      <h2>Личный кабинет</h2>

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
                <label className="btn btn-outline-primary mb-0 w-50">
                  Загрузить аватар
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Кнопка удаления аватара */}
              <div className="mb-3">
                <button 
                  className="btn btn-outline-danger mb-0 w-50"
                  onClick={handleDeleteAvatar}
                >
                  Удалить аватар
                </button>
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

                {isEditingUsername ? (
                  <>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      disabled={usernameLoading}
                    />
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleUsernameChange}
                        disabled={usernameLoading}
                      >
                        {usernameLoading ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelUserName}
                        disabled={usernameLoading}
                      >
                        Отмена
                      </button>
                    </div>
                    {usernameError && (
                      <div className="text-danger mt-2">{usernameError}</div>
                    )}
                    {usernameSuccess && (
                      <div className="text-success mt-2">Имя успешно изменено!</div>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="form-control"
                      value={user.userName}
                      readOnly
                    />
                    <button
                      className="btn btn-sm btn-outline-secondary mt-2"
                      onClick={() => setIsEditingUsername(true)}
                    >
                      Изменить username
                    </button>
                  </>
                )} 
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
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