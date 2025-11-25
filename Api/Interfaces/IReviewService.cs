using Api.ModelDto;
using Api.Models;

namespace Api.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetReviewsForFilmAsync(int filmId);
        Task<ReviewDto> GetReviewByIdAsync(int id);
        Task<ReviewDto> AddReviewAsync(int userId, int filmId, CreateReviewDto createReviewDto);
        Task<bool> UpdateReviewAsync(int id, ReviewDto dto);
        Task<bool> DeleteReviewAsync(int id);
    }
}
