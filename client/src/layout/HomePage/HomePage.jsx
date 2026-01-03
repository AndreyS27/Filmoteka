import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilmFilters from '../components/FilmFilters';

const baseApiUrl = 'https://localhost:7181/api';
const placeholderImageUrl = '/1920x1080.png';

const HomePage = () => {
  // Состояние для пагинированных данных
  const [pagedData, setPagedData] = useState({
    items: [],
    totalCount: 0,
    totalPages: 0,
    page: 1,
    pageSize: 10
  });

  // состояние для текущих фильтров
  const [currentFilters, setCurrentFilters] = useState({
    country: '',
    genre: '',
    sortBy: 'rating_desc'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем фильмы с пагинацией
  const fetchFilms = async (filters, page) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.country) params.append('country', filters.country);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      // Добавляем параметры пагинации
      params.append('page', page.toString());
      params.append('pageSize', '10'); // Фиксированный размер страницы

      const url = `${baseApiUrl}/films?${params.toString()}`;
      const response = await axios.get(url);

      // Обновляем состояние пагинации
      setPagedData({
        items: response.data.items || [],
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
        page: response.data.page || 1,
        pageSize: response.data.pageSize || 10
      });

      setCurrentFilters(filters);
    } catch (err) {
      console.error('Ошибка запроса фильмов:', err);
      setError(err.message || 'Не удалось загрузить фильмы');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем первую страницу при монтировании
  useEffect(() => {
    fetchFilms(currentFilters, 1);
  }, []);

  // Обработчик поиска (сбрасываем на первую страницу)
  const handleSearch = (filters) => {
    fetchFilms(filters, 1);
    // window.scrollTo(0, 0);
  };

  // Обработчик смены страницы (использует текущие фильтры)
  const handlePageChange = (page) => {
    fetchFilms(currentFilters, page);
    // window.scrollTo(0, 0);
  };

  if (loading && pagedData.items.length === 0) {
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
      <FilmFilters
        onSearch={handleSearch}
        currentFilters={currentFilters}
      />

      {/* Список фильмов */}
      <div className="row row-cols-3">
        {loading ? (
          <div className='col-12 text-center my-5'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Загрузка...</span>
            </div>
          </div>
        ) : pagedData.items.length === 0 ? (
          <p>Фильмы не найдены</p>
        ) : (
          pagedData.items.map((film) => {
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
                    <li className="list-group-item">
                      Оценка: {film.averageRating.toFixed(1)} на основе ({film.totalReviews} отзывов)
                    </li>
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

      {/* Пагинация */}
      {pagedData.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagedData.page <= 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagedData.page - 1)}
                disabled={pagedData.page <= 1}
              >
                Назад
              </button>
            </li>

            {/* Показываем максимум 5 страниц вокруг текущей */}
            {(() => {
              const pages = [];
              const startPage = Math.max(1, pagedData.page - 2);
              const endPage = Math.min(pagedData.totalPages, startPage + 4);

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <li
                    key={i}
                    className={`page-item ${pagedData.page === i ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </button>
                  </li>
                );
              }
              return pages;
            })()}

            <li className={`page-item ${pagedData.page >= pagedData.totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagedData.page + 1)}
                disabled={pagedData.page >= pagedData.totalPages}
              >
                Вперёд
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default HomePage;