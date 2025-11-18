using Api.Models;

namespace Api.Interfaces
{
    public interface IFilmRepository
    {
        Task<IEnumerable<Film>> GetAllFilmsAsync();
        Task<Film?> GetFilmByIdAsync(int id);
        Task<Film> AddFilmAsync(Film film);
        Task<Film?> UpdateFilmAsync(int id, Film film);
        Task <bool> DeleteFilmAsync(int id);
    }
}
