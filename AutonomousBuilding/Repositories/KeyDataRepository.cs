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
    public interface IKeyDataRepository
    {
        Task<IEnumerable<KeyData>> GetAllAsync();
        KeyData[] Tests();
        void Test(KeyData value);
        void Del(int id);
        void Edit(KeyData value);
        KeyData Find(int id);
        KeyData Check(string content);
    }

    public class KeyDataRepository : IKeyDataRepository
    {
        private readonly string connString;
        public KeyDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        //get from keys
        public async Task<IEnumerable<KeyData>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<KeyData>("select * from [Keys]");
            }
        }
        //post to keys
        public void Test(KeyData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO Keys (TypeID, Content)"
                                + " VALUES(@TypeID, @Content)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }
        public KeyData[] Tests()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM Keys";
                conn.Open();
                return conn.Query<KeyData>(sQuery).Cast<KeyData>().ToArray();
            }
        }
        //delete from keys
        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM Keys"
                            + " WHERE KeyID = @KeyID";
                conn.Open();
                conn.Execute(sQuery, new { KeyID = id });
            }
        }
        //edit keys
        public void Edit(KeyData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "UPDATE Keys SET TypeID = @TypeID"
                               + " WHERE KeyID = @KeyID";
                conn.Open();
                conn.Query(sQuery, value);
            }
        }
        //gets specific id
        public KeyData Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM Keys" +
                                " WHERE TypeID = @TypeID";
                conn.Open();
                return conn.Query<KeyData>(sQuery, new { TypeID = id }).FirstOrDefault();
            }
        }

        //gets key for content
        public KeyData Check(string content)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM Keys" +
                                " WHERE Content = @Content";
                conn.Open();
                return conn.Query<KeyData>(sQuery, new { Content = content }).FirstOrDefault();
            }
        }
    }
}
