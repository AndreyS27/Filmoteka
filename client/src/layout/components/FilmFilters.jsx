import { useState, useEffect } from 'react';
import axios from 'axios';

const baseApiUrl = 'https://localhost:7181/api';

const FilmFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    country: '',
    genre: '',
    sortBy: 'year_desc'
  });
  
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем уникальные значения при монтировании
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}/films/filters`);
        setUniqueCountries(response.data.countries);
        setUniqueGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  if (loading) {
    return <div>Загрузка фильтров...</div>;
  }

  return (
    <div className="row mb-4 align-items-end">
      <div className="col-md-3">
        <label className="form-label">Страна</label>
        <select 
          className="form-select"
          name="country"
          value={filters.country}
          onChange={handleInputChange}
        >
          <option value="">Все страны</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      
      <div className="col-md-3">
        <label className="form-label">Жанр</label>
        <select 
          className="form-select"
          name="genre"
          value={filters.genre}
          onChange={handleInputChange}
        >
          <option value="">Все жанры</option>
          {uniqueGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      
      <div className="col-md-3">
        <label className="form-label">Сортировка</label>
        <select 
          className="form-select"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
        >
          <option value="year_desc">Год: Новые → Старые</option>
          <option value="year_asc">Год: Старые → Новые</option>
        </select>
      </div>
      
      <div className="col-md-3">
        <button 
          className="btn btn-primary w-100" 
          onClick={handleSearch}
        >
          Найти
        </button>
      </div>
    </div>
  );
};

export default FilmFilters;