using Api.Models;

namespace Api.ModelDto
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
        public ReviewAuthorDto Author { get; set; } = null!;
    }
}
