using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class ExternalLink
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int UrlTypeId { get; set; }
        public string UrlType { get; set; }
        public string Url { get; set; }
        public int EntityId { get; set; }
        public int EntityTypeId { get; set; }
        public string UrlName { get; set; }
        public string EntityType { get; set; }
    }

   }




