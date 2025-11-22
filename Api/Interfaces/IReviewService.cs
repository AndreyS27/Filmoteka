using Api.Models;

namespace Api.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetReviewsForFilmAsync(int filmId);
        Task<Review?> GetReviewByIdAsync(int id);
        Task<Review> AddReviewAsync(Review review);
        Task<Review> UpdateReviewAsync(Review review);
        Task<bool> DeleteReviewAsync(int id);
    }
}
