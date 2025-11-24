using Api.Interfaces;
using Api.ModelDto;
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

        public async Task<IEnumerable<ReviewDto>> GetReviewsForFilmAsync(int filmId)
        {
            var reviews = await _reposritory.GetReviewsForFilmAsync(filmId);
            return reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                Text = r.Text,
                Rating = r.Rating,
                Author = new ReviewAuthorDto
                {
                    Id = r.UserId,
                    UserName = r.User.UserName,
                    AvatarUrl = r.User.AvatarUrl
                }
            }).ToList();
        }

        public async Task<bool> UpdateReviewAsync(int id, ReviewDto dto)
        {
            var existingReview = await _reposritory.GetReviewByIdAsync(id);
            if (existingReview == null)
            {
                return false;
            }

            existingReview.Text = dto.Text;
            existingReview.Rating = dto.Rating;

            await _reposritory.UpdateReviewAsync(existingReview);
            return true;
        }
    }
}
