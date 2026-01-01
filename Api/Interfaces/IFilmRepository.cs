using Api.ModelDto;
using Api.Models;

namespace Api.Interfaces
{
    public interface IFilmRepository
    {
        Task<IEnumerable<Film>> GetAllFilmsAsync();
        Task<IEnumerable<Film>> GetFilmsAsync(
            string? country = null, 
            string? genre = null,
            string? sortBy = null);
        Task<Film?> GetFilmByIdAsync(int id);
        Task<Film> AddFilmAsync(Film film);
        Task<Film?> UpdateFilmAsync(int id, FilmDto film);
        Task<bool> DeleteFilmAsync(int id);
        Task<PagedResult<FilmWithRatingDto>> GetFilmsPagedAsync(
            string? country = null,
            string? genre = null,
            string? sortBy = null,
            int page = 1,
            int pageSize = 10); 
    }
}
