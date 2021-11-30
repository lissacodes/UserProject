using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.ExternalLinks
{
    public class ExternalLinkUpdateRequest : ExternalLinkAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
