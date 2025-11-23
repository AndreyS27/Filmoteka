using Api.ModelDto;
using Api.Models;

namespace Api.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetReviewsForFilmAsync(int filmId);
        Task<Review?> GetReviewByIdAsync(int id);
        Task<Review> AddReviewAsync(Review review);
        Task<bool> UpdateReviewAsync(int id, ReviewDto dto);
        Task<bool> DeleteReviewAsync(int id);
    }
}
