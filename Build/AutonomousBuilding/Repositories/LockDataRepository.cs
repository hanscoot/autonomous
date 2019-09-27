using AutonomousBuilding.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Repositories
{
    public interface ILockDataRepository
    {
        Task<IEnumerable<LockData>> GetAllAsync();
        void Test(LockData value);
        void Del(int id);
        void Edit(LockData value);
        LockData Find(int id);
    }

    public class LockDataRepository : ILockDataRepository
    {
        private readonly string connString;
        public LockDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        //get from locks
        public async Task<IEnumerable<LockData>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<LockData>("select * from [Locks]");
            }
        }
        //post to locks
        public void Test(LockData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO Locks (Name, LockTypeID)"
                                + " VALUES(@Name, @LockTypeID)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }
        //delete from locks
        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM Locks"
                            + " WHERE LockID = @LockID";
                conn.Open();
                conn.Execute(sQuery, new { LockID = id });
            }
        }
        //edit locks
        public void Edit(LockData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "UPDATE Locks SET Name = @Name, LockTypeID = @LockTypeID"
                               + " WHERE LockID = @LockID";
                conn.Open();
                conn.Query(sQuery, value);
            }
        }

        public LockData Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM Locks" +
                                " WHERE LockID = @LockID";
                conn.Open();
                return conn.Query<LockData>(sQuery, new { LockID = id }).FirstOrDefault();
            }
        }
    }
}
