using Api.Interfaces;
using Api.ModelDto;
using Api.Models;

namespace Api.Services
{
    public class FilmService : IFilmService
    {
        private readonly IFilmRepository _repository;

        public FilmService(IFilmRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Film>> GetAllFilmsAsync(string? country = null, string? genre = null, string? sortBy = null)
        {
            return await _repository.GetAllFilmsAsync(country, genre, sortBy);
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

    }
}
