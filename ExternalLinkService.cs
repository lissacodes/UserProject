using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests.ExternalLinks;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Sabio.Services.Interfaces;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ExternalLinkService : IExternalLinkService

    {
        IDataProvider _dataProvider = null;
        

        public ExternalLinkService(IDataProvider dataProvider)
           {
            _dataProvider = dataProvider;
           


           }

        public ExternalLink GetByCurrent(int userId)
        {
            string procName = "[dbo].[ExternalLinks_SelectByCurrent]";

            ExternalLink externalLink = null;

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", userId);
                },
                delegate (IDataReader reader, short set)
                {

                    externalLink = MapExternalLink(reader);
                });

            return externalLink;
        }

        public List<ExternalLink> GetById(int id)
        {
            string procName = "[dbo].[ExternalLinks_SelectById]";
            List<ExternalLink> list = null;

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                    
                },
                delegate (IDataReader reader, short set)
                {
                    ExternalLink externalLink = MapExternalLink(reader);
                    if (list == null)
                    {
                        list = new List<ExternalLink>();
                    }
                    list.Add(externalLink);
                });
            return list;
               
        }
        public int Add(ExternalLinkAddRequest model)
        {
            int id = 0;

            string procName = "[dbo].[ExternalLinks_Insert]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[ExternalLinks_DeleteById]";
            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                });
        }

        public void Update(ExternalLinkUpdateRequest model)
        {
            string procName = "[dbo].[ExternalLinks_Update]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);

            }, returnParameters: null);
        }

        private static void AddCommonParams(ExternalLinkAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@UrlTypeId", model.UrlTypeId);
            col.AddWithValue("@Url", model.Url);
            col.AddWithValue("@EntityId", model.EntityId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            
        }

        public ExternalLink MapExternalLink(IDataReader reader)
        {
            ExternalLink externalLink= new ExternalLink();
            int startingIndex = 0;

            externalLink.Id = reader.GetSafeInt32(startingIndex++);
            externalLink.UserId = reader.GetSafeInt32(startingIndex++);
            externalLink.Url = reader.GetSafeString(startingIndex++);
            externalLink.EntityId = reader.GetSafeInt32(startingIndex++);
            externalLink.UrlTypeId = reader.GetSafeInt32(startingIndex++);
            externalLink.UrlName = reader.GetSafeString(startingIndex++);
            externalLink.EntityTypeId = reader.GetSafeInt32(startingIndex++);
            externalLink.EntityType = reader.GetSafeString(startingIndex++);
            

            return externalLink;
        }

        
    }


}
