namespace Api.Exceptions
{
    public class ReviewExceptions : Exception
    {
        public ReviewExceptions(string message) : base(message) { }

        public class ReviewNotFoundException : ReviewExceptions
        {
            public ReviewNotFoundException() : base("Review not found.") { }
        }

        public class UnauthorizedReviewEditException : ReviewExceptions
        {
            public UnauthorizedReviewEditException() : base("You can only edit your own reviews.") { }
        }
    }
}
