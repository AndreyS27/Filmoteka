using Api.Interfaces;
using Api.Models;

namespace Api.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reposritory;

        public ReviewService(IReviewRepository repository)
        {
            _reposritory = repository;
        }

        public async Task<Review> AddReviewAsync(Review review)
        {
            return await _reposritory.AddReviewAsync(review);
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            return await _reposritory.DeleteReviewAsync(id);
        }

        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            return await _reposritory.GetReviewByIdAsync(id);
        }

        public async Task<IEnumerable<Review>> GetReviewsForFilmAsync(int filmId)
        {
            return await _reposritory.GetReviewsForFilmAsync(filmId);
        }

        public async Task<Review> UpdateReviewAsync(Review review)
        {
            return await _reposritory.UpdateReviewAsync(review);
        }
    }
}
