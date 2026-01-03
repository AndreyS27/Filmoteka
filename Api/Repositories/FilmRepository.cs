using Api.Data;
using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class FilmRepository : IFilmRepository
    {
        private readonly ApplicationDbContext _context;

        public FilmRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Film>> GetAllFilmsAsync()
        {
            return await _context.Films.ToListAsync();
        }

        public async Task<IEnumerable<Film>> GetFilmsAsync(
            string? country = null, 
            string? genre = null, 
            string? sortBy = null)
        {
            var films = await _context.Films.ToListAsync();

            // Фильтрация в памяти
            if (!string.IsNullOrEmpty(country))
            {
                films = films.Where(f =>
                    f.Country.Split(',')
                        .Any(c => c.Trim().Equals(country.Trim(), StringComparison.OrdinalIgnoreCase)))
                    .ToList();
            }

            if (!string.IsNullOrEmpty(genre))
            {
                films = films.Where(f =>
                    f.Genre.Split(',')
                        .Any(g => g.Trim().Equals(genre.Trim(), StringComparison.OrdinalIgnoreCase)))
                    .ToList();
            }

            // Сортировка
            films = sortBy?.ToLowerInvariant() switch
            {
                "year_asc" => films.OrderBy(f => f.Year).ToList(),
                "year_desc" => films.OrderByDescending(f => f.Year).ToList(),
                _ => films.OrderBy(f => f.Id).ToList()
            };

            return films;
        }

        public async Task<Film?> GetFilmByIdAsync(int id)
        {
            return await _context.Films.FindAsync(id);
        }

        public async Task<Film> AddFilmAsync(Film film)
        {
            _context.Films.Add(film);
            await _context.SaveChangesAsync();
            return film;
        }

        public async Task<Film?> UpdateFilmAsync(int id, FilmDto film)
        {
            var existingFilm = await _context.Films.FindAsync(id);
            if (existingFilm == null) 
            {
                return null;
            }

            existingFilm.Name = film.Name;
            existingFilm.Year = film.Year;
            existingFilm.Duration = film.Duration;
            existingFilm.Country = film.Country;
            existingFilm.Genre = film.Genre;
            existingFilm.Director = film.Director;
            existingFilm.Description = film.Description;
            existingFilm.PosterPath = film.PosterPath;

            await _context.SaveChangesAsync();
            return existingFilm;
        }

        public async Task<bool> DeleteFilmAsync(int id)
        {
            var film = await _context.Films.FindAsync(id);
            if (film == null)
            {
                return false;
            }

            _context.Films.Remove(film);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<FilmWithRatingDto>> GetFilmsPagedAsync(
            string? country = null, 
            string? genre = null, 
            string? sortBy = null, 
            int page = 1, 
            int pageSize = 10)
        {
            var query = _context.Films.AsQueryable();

            // Фильтрация
            if (!string.IsNullOrEmpty(country))
            {
                query = query.Where(f =>
                EF.Functions.Like(f.Country, $"%{country}%"));
            }

            if (!string.IsNullOrEmpty(genre))
            {
                query = query.Where(f =>
                EF.Functions.Like(f.Genre, $"%{genre}%"));
            }

            // Сортировка
            query = ApplySorting(query, sortBy);

            // общее количество для пагинации
            var totalCount = await query.CountAsync();

            var films = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new FilmWithRatingDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Year = f.Year,
                    Duration = f.Duration,
                    Country = f.Country,
                    Genre = f.Genre,
                    Director = f.Director,
                    Description = f.Description,
                    PosterPath = f.PosterPath,
                    AverageRating = _context.Reviews
                        .Where(r => r.FilmId == f.Id)
                        .Average(r => (double?)r.Rating) ?? 0,
                    TotalReviews = _context.Reviews
                        .Count(r => r.FilmId == f.Id)
                })
                .ToListAsync();

            return new PagedResult<FilmWithRatingDto>
            {
                Items = films,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        private IQueryable<Film> ApplySorting (IQueryable<Film> query, string? sortBy)
        {
            if (string.IsNullOrEmpty(sortBy))
                return query.OrderByDescending(f => f.Id);

            var sortLower = sortBy.ToLowerInvariant();

            return sortLower switch
            {
                "year_asc" => query.OrderBy(f => f.Year),
                "year_desc" => query.OrderByDescending(f => f.Year),
                "rating_asc" => query.OrderBy(f =>
                    _context.Reviews.Where(r => r.FilmId == f.Id).Average(r => (double?)r.Rating) ?? 0),
                "rating_desc" => query.OrderByDescending(f =>
                    _context.Reviews.Where(r => r.FilmId == f.Id).Average(r => (double?)r.Rating) ?? 0),
                _ => query.OrderByDescending(f => f.Id)
            };
        }
    }
}
