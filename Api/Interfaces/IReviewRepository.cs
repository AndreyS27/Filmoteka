using Api.ModelDto;
using Api.Models;

namespace Api.Interfaces
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetReviewsForFilmAsync(int filmId);
        Task<Review?> GetReviewByIdAsync(int id);
        Task<Review> AddReviewAsync(Review review);
        Task<Review?> UpdateReviewAsync(int reviewId, string title, string text, int rating);
        Task<bool> DeleteReviewAsync(int id);
    }
}
