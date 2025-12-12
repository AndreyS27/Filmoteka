using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
using static Api.Exceptions.ReviewExceptions;

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
                Title = dto.Title,
                Text = dto.Text,
                Rating = dto.Rating,
                UserId = userId,
                FilmId = filmId,
            };

            var createdReview = await _reposritory.AddReviewAsync(review);

            return new ReviewDto
            {
                Id = createdReview.Id,
                Title = createdReview.Title,
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

        public async Task<ReviewDto?> GetReviewByIdAsync(int id)
        {
            var review = await _reposritory.GetReviewByIdAsync(id);

            if (review == null)
            {
                return null;
            }

            return new ReviewDto
            {
                Id = review.Id,
                Title = review.Title,
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
                Title = r.Title,
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

        public async Task<ReviewUpdateDto?> UpdateReviewAsync(int id, int currentUserId, ReviewUpdateDto dto)
        {
            var existingReview = await _reposritory.GetReviewByIdAsync(id);
            if (existingReview == null)
            {
                throw new ReviewNotFoundException();
            }

            if (existingReview.UserId != currentUserId)
            {
                throw new UnauthorizedReviewEditException();
            }

            var updatedReview = await _reposritory.UpdateReviewAsync(id, dto.Title, dto.Text, dto.Rating);

            if (updatedReview == null)
            {
                throw new ReviewNotFoundException();
            }

            return new ReviewUpdateDto
            {
                Title = dto.Title,
                Rating = dto.Rating,
                Text = dto.Text
            };
        }
    }
}
