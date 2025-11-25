using Api.Interfaces;
using Api.ModelDto;
using Api.Models;

namespace Api.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reposritory;

        public ReviewService(IReviewRepository repository, IFilmRepository filmRepository)
        {
            _reposritory = repository;
        }

        public async Task<ReviewDto> AddReviewAsync(int userId, int filmId, CreateReviewDto dto)
        {
            var review = new Review
            {
                Text = dto.Text,
                Rating = dto.Rating,
                UserId = userId,
                FilmId = filmId,
            };

            var createdReview = await _reposritory.AddReviewAsync(review);

            return new ReviewDto
            {
                Id = createdReview.Id,
                Text = createdReview.Text,
                Rating = createdReview.Rating,
                Author = new ReviewAuthorDto
                {
                    Id = createdReview.User.Id,
                    UserName = createdReview.User.UserName,
                    AvatarUrl = createdReview.User.AvatarUrl
                }
            };
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            return await _reposritory.DeleteReviewAsync(id);
        }

        public async Task<ReviewDto> GetReviewByIdAsync(int id)
        {
            var review = await _reposritory.GetReviewByIdAsync(id);
            return new ReviewDto
            {
                Id = review.Id,
                Text = review.Text,
                Rating = review.Rating,
                Author = new ReviewAuthorDto
                {
                    Id = review.UserId,
                    UserName = review.User.UserName,
                    AvatarUrl = review.User.AvatarUrl
                }
            };
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
