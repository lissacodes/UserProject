using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class UserProfile
    {
        public int ProfileId { get; set; }
        public string GivenName { get; set; }
        public string Surnames { get; set; }
        public string AvatarUrl { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }

        public int UrlTypeId { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
