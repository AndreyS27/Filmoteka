import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilmFilters from '../components/FilmFilters';

const baseApiUrl = 'https://localhost:7181/api';
const placeholderImageUrl = '/1920x1080.png';

const HomePage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем фильмы (все или с фильтрами)
  const fetchFilms = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Формируем query string только с непустыми фильтрами
      const params = new URLSearchParams();
      if (filters.country) params.append('country', filters.country);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const url = `${baseApiUrl}/films${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axios.get(url);
      setFilms(response.data);
    } catch (err) {
      console.error('Ошибка запроса фильмов:', err);
      setError(err.message || 'Не удалось загрузить фильмы');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем все фильмы при первом открытии страницы
  useEffect(() => {
    fetchFilms();
  }, []);

  // Обработчик нажатия кнопки "Найти"
  const handleSearch = (filters) => {
    fetchFilms(filters);
  };

  if (loading && films.length === 0) {
    return (
      <div className="container-fluid mt-5">
        <p>Загрузка фильмов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-5">
        <p className="text-danger">Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-2">
      <h1>Фильмы</h1>
      
      {/* Компонент фильтров */}
      <FilmFilters onSearch={handleSearch} />
      
      {/* Список фильмов */}
      <div className="row row-cols-3">
        {films.length === 0 ? (
          <p>Фильмы не найдены</p>
        ) : (
          films.map((film) => {
            const posterUrl = film.posterPath
              ? `https://localhost:7181${film.posterPath}`
              : placeholderImageUrl;

            return (
              <div className="col" key={film.id}>
                <div className="card m-3">
                  <img
                    src={posterUrl}
                    className="card-img-top"
                    alt={film.name}
                    onError={(e) => e.currentTarget.src = placeholderImageUrl}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{film.name}</h5>
                    <p className="card-text">{film.description.slice(0, 50)}...</p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">Длительность: {film.duration}</li>
                    <li className="list-group-item">Год выпуска: {film.year}</li>
                    <li className="list-group-item">Страна: {film.country}</li>
                    <li className="list-group-item">Режиссер: {film.director}</li>
                    <li className="list-group-item">Жанр: {film.genre}</li>
                  </ul>
                  <Link to={`/films/${film.id}`} className="btn btn-light m-3">
                    Подробнее
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomePage;