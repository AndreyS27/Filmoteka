using Api.Interfaces;
using Api.ModelDto;
using Api.Models;

namespace Api.Services
{
    public class FilmService : IFilmService
    {
        private readonly IFilmRepository _repository;
        private readonly IReviewService _reviewService;

        public FilmService(IFilmRepository repository, IReviewService reviewService)
        {
            _repository = repository;
            _reviewService = reviewService;
        }

        public async Task<IEnumerable<FilmWithRatingDto>> GetFilmsWithRatingsAsync(
            string? country = null,
            string? genre = null,
            string? sortBy = null)
        {
            var films = await _repository.GetFilmsAsync(country, genre, null);
            var filmDtos = new List<FilmWithRatingDto>();

            // Загружаем рейтинги для каждого фильма
            foreach (var film in films)
            {
                var ratingDto = await _reviewService.GetAverageRatingByFilmIdAsync(film.Id);

                filmDtos.Add(new FilmWithRatingDto
                {
                    Id = film.Id,
                    Name = film.Name,
                    Year = film.Year,
                    Duration = film.Duration,
                    Country = film.Country,
                    Genre = film.Genre,
                    Director = film.Director,
                    Description = film.Description,
                    PosterPath = film.PosterPath,
                    AverageRating = ratingDto.AverageRating,
                    TotalReviews = ratingDto.TotalReviews
                });
            }

            // Многоуровневая сортировка (код из предыдущего ответа)
            if (!string.IsNullOrEmpty(sortBy))
            {
                var sortFields = sortBy.Split(',');
                IOrderedEnumerable<FilmWithRatingDto> orderedFilms = null;

                foreach (var field in sortFields)
                {
                    var (propertyName, isDescending) = ParseSortField(field.Trim());

                    if (orderedFilms == null)
                    {
                        orderedFilms = isDescending
                            ? filmDtos.OrderByDescending(f => GetPropertyValue(f, propertyName))
                            : filmDtos.OrderBy(f => GetPropertyValue(f, propertyName));
                    }
                    else
                    {
                        orderedFilms = isDescending
                            ? orderedFilms.ThenByDescending(f => GetPropertyValue(f, propertyName))
                            : orderedFilms.ThenBy(f => GetPropertyValue(f, propertyName));
                    }
                }

                if (orderedFilms != null)
                    filmDtos = orderedFilms.ToList();
            }

            return filmDtos;
        }

        public async Task<FilmWithRatingDto?> GetFilmByIdWithRatingAsync(int id)
        {
            var film = await _repository.GetFilmByIdAsync(id);
            if (film == null)
                return null;

            var ratingDto = await _reviewService.GetAverageRatingByFilmIdAsync(film.Id);
            return new FilmWithRatingDto
            {
                Id = film.Id,
                Name = film.Name,
                Year = film.Year,
                Duration = film.Duration,
                Country = film.Country,
                Genre = film.Genre,
                Director = film.Director,
                Description = film.Description,
                PosterPath = film.PosterPath,
                AverageRating = ratingDto.AverageRating,
                TotalReviews = ratingDto.TotalReviews
            };
        }

        public async Task<IEnumerable<Film>> GetAllFilmsAsync()
        {
            return await _repository.GetAllFilmsAsync();
        }

        public async Task<IEnumerable<Film>> GetFilmsAsync(
            string? country = null, 
            string? genre = null, 
            string? sortBy = null)
        {
            return await _repository.GetFilmsAsync(country, genre, sortBy);
        }

        public async Task<Film?> GetFilmByIdAsync(int id)
        {
            return await _repository.GetFilmByIdAsync(id);
        }

        public async Task<Film> AddFilmAsync(Film film)
        {
            return await _repository.AddFilmAsync(film);
        }

        public async Task<Film?> UpdateFilmAsync(int id, FilmDto film)
        {
            return await _repository.UpdateFilmAsync(id, film);
        }

        public async Task<bool> DeleteFilmAsync(int id)
        {
            return await _repository.DeleteFilmAsync(id);
        }

        // Вспомогательные методы
        private (string propertyName, bool isDescending) ParseSortField(string field)
        {
            if (field.EndsWith("_desc"))
                return (field.Substring(0, field.Length - 5), true);
            if (field.EndsWith("_asc"))
                return (field.Substring(0, field.Length - 4), false);

            return(field, false);
        }

        private object GetPropertyValue(FilmWithRatingDto film, string propertyName)
        {
            return propertyName.ToLowerInvariant() switch
            {
                "year" => film.Year,
                "rating" => film.AverageRating,
                _ => film.Id
            };
        }

    }
}
