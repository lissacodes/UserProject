using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ExternalLinks;
using System;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces 
{
    public interface IExternalLinkService
    {
        ExternalLink GetByCurrent(int userId);
        List<ExternalLink> GetById(int id);

        int Add(ExternalLinkAddRequest model);

        void Delete(int id);

        void Update(ExternalLinkUpdateRequest model);
    }
}