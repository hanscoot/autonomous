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
    public interface ILockKeyDataRepository
    {
        Task<IEnumerable<LockKey>> GetAllAsync();
        void Test(LockKey value);
        void Del(int id);
        LockKey[] Finds(int id);
        LockKey[] Find(int id);
        LockKeyName Name(int id);
    }

    public class LockKeyDataRepository : ILockKeyDataRepository
    {
        private readonly string connString;
        public LockKeyDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        //get from keys
        public async Task<IEnumerable<LockKey>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<LockKey>("SELECT LockKeys.LockKeyID, LockKeys.LockID, Keys.KeyID" + 
                                                    " FROM LockKeys" + 
                                                    " INNER JOIN Locks ON Locks.LockId = LockKeys.LockID" + 
                                                    " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID");
            }
        }
        //post to keys
        public void Test(LockKey value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO LockKeys (LockID, KeyID)"
                                + " VALUES(@LockID,@KeyID)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }
        //delete from keys
        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM LockKeys"
                            + " WHERE LockKeyID = @LockKeyID";
                conn.Open();
                conn.Execute(sQuery, new { LockKeyID = id });
            }
        }
        //gets specific id
        public LockKey[] Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT LockKeys.LockKeyID, Keys.KeyID" +
                                                    " FROM LockKeys" +
                                                    " INNER JOIN Locks ON Locks.LockId = LockKeys.LockID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID" +
                                                    " WHERE LockKeys.LockID = @LockID";
                conn.Open();
                return conn.Query<LockKey>(sQuery, new { LockID = id }).Cast<LockKey>().ToArray();
            }
        }

        //gets specific id
        public LockKey[] Finds(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT LockKeys.LockKeyID, Keys.KeyID, Locks.LockID" +
                                                    " FROM LockKeys" +
                                                    " INNER JOIN Locks ON Locks.LockId = LockKeys.LockID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID" +
                                                    " WHERE LockKeys.LockID = @LockID";
                conn.Open();
                return conn.Query<LockKey>(sQuery, new { LockID = id }).Cast<LockKey>().ToArray();
            }
        }

        //gets specific id
        public LockKeyName Name(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT LockKeys.LockKeyID, Keys.KeyID, Locks.Name" +
                                                    " FROM LockKeys" +
                                                    " INNER JOIN Locks ON Locks.LockId = LockKeys.LockID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID" +
                                                    " WHERE LockKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<LockKeyName>(sQuery, new { KeyID = id }).FirstOrDefault();
            }
        }

    }
}
