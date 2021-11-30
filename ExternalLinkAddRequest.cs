using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ExternalLinkAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int UserId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int UrlTypeId { get; set; }
        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string Url { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityTypeId { get; set; }

    }
}
