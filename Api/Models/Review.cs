namespace Api.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int FilmId { get; set; }
        public User User { get; set; } = null!;
        public Film Film { get; set; } = null!;
    }
}
