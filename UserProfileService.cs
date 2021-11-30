using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests.UserProfile;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserProfileService : IUserProfileService
    {
        IDataProvider _data = null;
        public UserProfileService(IDataProvider data) 
        {
            this._data = data;
        }

        public int Add(UserProfileAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[UserProfile_Insert_V2]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@GivenName", model.GivenName);
                col.AddWithValue("@Surnames", model.Surnames);
                col.AddWithValue("@AvatarUrl", model.AvatarUrl);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@Url", model.Url);
                col.AddWithValue("@UrlTypeId", model.UrlTypeId);

                SqlParameter idOut = new SqlParameter("@ProfileId", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@ProfileId"].Value;

                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void Update(UserProfileUpdateRequest model)
        {
            string procName = "[dbo].[UserProfile_Update_V2]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@GivenName", model.GivenName);
                col.AddWithValue("@Surnames", model.Surnames);
                col.AddWithValue("@AvatarUrl", model.AvatarUrl);
                col.AddWithValue("@Url", model.Url);
                col.AddWithValue("@ProfileId", model.Id);
            });
        }

        public UserProfile GetByUserId(int id)
        {
            string procName = "[dbo].[UserProfile_GetByUserId]";

            UserProfile userProfile = null;
            List<LookUp<int>> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", id);

            }, delegate (IDataReader reader, short set)
            {
                userProfile = new UserProfile();
                int startingIndex = 0;
                list = new List<LookUp<int>>();

                userProfile.ProfileId = reader.GetSafeInt32(startingIndex++);
                userProfile.GivenName = reader.GetSafeString(startingIndex++);
                userProfile.Surnames = reader.GetSafeString(startingIndex++);
                userProfile.AvatarUrl = reader.GetSafeString(startingIndex++);
                userProfile.UserId = reader.GetSafeInt32(startingIndex++);
                userProfile.Email = reader.GetSafeString(startingIndex++);
                list = reader.DeserializeObject<List<LookUp<int>>>(startingIndex++);
                if (list != null)
                {
                    userProfile.Roles = MapRoles(list);
                }
                userProfile.DateCreated = reader.GetSafeDateTime(startingIndex++);
                userProfile.DateModified = reader.GetSafeDateTime(startingIndex++);
            });
            return userProfile;
        }

        private List<string> MapRoles(List<LookUp<int>> list)
        {
            List<string> newList = null;
            foreach (LookUp<int> item in list)
            {
                if (newList == null)
                {
                    newList = new List<string>();
                }

                newList.Add(item.Name);
            }

            return newList;
        }
    }
}
