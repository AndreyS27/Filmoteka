using Api.ModelDto;
using Api.Models;

namespace Api.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetReviewsForFilmAsync(int filmId);
        Task<ReviewDto?> GetReviewByIdAsync(int id);
        Task<ReviewDto> AddReviewAsync(int userId, int filmId, CreateReviewDto createReviewDto);
        Task<ReviewUpdateDto?> UpdateReviewAsync(int id, int userId, ReviewUpdateDto dto);
        Task<bool> DeleteReviewAsync(int id);
        Task<IEnumerable<UserReviewDto>> GetReviewByUserIdAsync(int userId);
    }
}
