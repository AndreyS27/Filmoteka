using Api.ModelDto;
using Api.Models;

namespace Api.Interfaces
{
    public interface IFilmService
    {
        Task<IEnumerable<Film>> GetAllFilmsAsync();
        Task<Film?> GetFilmByIdAsync(int id);
        Task<Film> AddFilmAsync(Film film);
        Task<Film?> UpdateFilmAsync(int id, FilmDto film);
        Task<bool> DeleteFilmAsync(int id);
    }
}
