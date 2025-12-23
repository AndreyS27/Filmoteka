using Api.Data;
using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
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

        public async Task<IEnumerable<Film>> GetAllFilmsAsync(string? country = null, string? genre = null, string? sortBy = null)
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

    }
}
