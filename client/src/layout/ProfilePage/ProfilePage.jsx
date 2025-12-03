
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Загрузка...</div>; // Или редирект на /login
  }

  return (
    <div className="profile-page">
      <h2>Личный кабинет</h2>
      <p><strong>Имя пользователя:</strong> {user.userName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>ID: {user.id}</p>
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt="Аватар" className="avatar" />
      )}
    </div>
  );
};

export default ProfilePage;