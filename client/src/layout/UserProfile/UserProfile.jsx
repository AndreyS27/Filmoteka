import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <p><strong>Имя пользователя:</strong> {user.userName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>ID: {user.id}</p>
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt="Аватар" className="avatar" />
      )}
    </div>
  );
};

export default UserProfile;