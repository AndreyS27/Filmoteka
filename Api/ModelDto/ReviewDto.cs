using Api.Models;

namespace Api.ModelDto
{
    public class ReviewDto
    {
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
    }
}
