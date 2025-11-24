using Microsoft.AspNetCore.Identity;

namespace Api.Models
{
    public class User : IdentityUser<int>
    {
        public string AvatarUrl { get; set; } = string.Empty;
    }
}
