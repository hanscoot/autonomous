using AutonomousBuilding.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Repositories
{
    public interface ILogRepository
    {
        Task<IEnumerable<Log>> GetAllAsync();
        void Test(Log value);
        void Del(int id);
    }

    public class LogRepository : ILogRepository
    {
        private readonly string connString;
        public LogRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        public async Task<IEnumerable<Log>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<Log>("select * from [Log]");
            }
        }
    
        public void Test(Log value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO Log (LockName, Name, Time, Status)"
                                + " VALUES(@LockName, @Name, @Time, @Status)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }

        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM Log"
                            + " WHERE LogID = @LogID";
                conn.Open();
                conn.Execute(sQuery, new { LogID = id });
            }
        }
    }
}
