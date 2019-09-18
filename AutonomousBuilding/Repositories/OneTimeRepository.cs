using AutonomousBuilding.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Repositories
{
    public interface IOneTimeRepository
    {
        Task<IEnumerable<OneTime>> GetUsers();
        OneTime Find(int id);
        void Post(OneTime value);
        void Delete(int id);
    }

    public class OneTimeRepository : IOneTimeRepository
    {
        private readonly string connString;
        public OneTimeRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }
    
        public OneTime Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM OneTime" + " WHERE PersonID = @PersonID";
                conn.Open();
                return conn.Query<OneTime>(sQuery, new { PersonID = id }).FirstOrDefault();
            }
        }

        public async Task<IEnumerable<OneTime>> GetUsers()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<OneTime>("SELECT * FROM OneTime");
            }
        }

        public void Post(OneTime value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO OneTime (LockID, Time, Date, PersonID, KeyID)"
                                + " VALUES(@LockID, @Time, @Date, @PersonID, @KeyID)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }

        public void Delete(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM OneTime"
                            + " WHERE UserID = @UserID";
                conn.Open();
                conn.Execute(sQuery, new { UserID = id });
            }
        }
    }
}
