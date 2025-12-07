import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const baseApiUrl = 'https://localhost:7181/api';

const EditFilmPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    duration: '',
    country: '',
    genre: '',
    director: '',
    description: '',
    posterPath: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${baseApiUrl}/films/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const film = response.data;
        setFormData({
          name: film.name,
          year: film.year.toString(),
          duration: film.duration,
          country: film.country,
          genre: film.genre,
          director: film.director,
          description: film.description,
          posterPath: film.posterPath || ''
        });
        setInitialData(film);
      } catch (err) {
        console.error('Error:', err);
        setError('Ошибка загрузки данных фильма');
      }
    };

    fetchFilm();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Обновляем основные данные
      const filmDto = {
        name: formData.name,
        year: parseInt(formData.year),
        duration: formData.duration,
        country: formData.country,
        genre: formData.genre,
        director: formData.director,
        description: formData.description,
        posterPath: formData.posterPath // Сохраняем текущий путь
      };

      await axios.put(`${baseApiUrl}/films/${id}`, filmDto, {
        headers: { Authorization: `Bearer ${token}` }
      });

      //Загружаем новый постер, если выбран
      if (posterFile) {
        const formDataImg = new FormData();
        formDataImg.append('file', posterFile);
        
        const posterResponse = await axios.post(
          `${baseApiUrl}/films/${id}/poster`, 
          formDataImg,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        // Обновляем путь к постеру
        setFormData(prev => ({ 
          ...prev, 
          posterPath: posterResponse.data.posterUrl 
        }));
      }

      navigate('/admin');
    } catch (err) {
      console.error('Error:', err);
      setError('Ошибка при сохранении фильма');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  if (!initialData) {
    return <div className="container mt-5">Загрузка...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Редактировать фильм: {initialData.name}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Название *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Год выпуска *</label>
              <input
                type="number"
                className="form-control"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max="2025"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Длительность (чч:мм:сс) *</label>
              <input
                type="text"
                className="form-control"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="01:30:00"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Страна *</label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Жанр *</label>
              <input
                type="text"
                className="form-control"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Режиссер *</label>
              <input
                type="text"
                className="form-control"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Описание *</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Текущий постер</label>
              {formData.posterPath ? (
                <img 
                  src={`https://localhost:7181${formData.posterPath}`} 
                  alt="Постер" 
                  className="img-thumbnail"
                  style={{ width: '150px', height: 'auto' }}
                />
              ) : (
                <p>Нет постера</p>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Заменить постер</label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-4">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFilmPage;