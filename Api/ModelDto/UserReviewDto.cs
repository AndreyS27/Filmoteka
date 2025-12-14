namespace Api.ModelDto
{
    public class UserReviewDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int FilmId { get; set; }
        public string FilmName { get; set;  } = string.Empty;
    }
}
