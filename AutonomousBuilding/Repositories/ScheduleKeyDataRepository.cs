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
    public interface IScheduleKeyDataRepository
    {
        Task<IEnumerable<ScheduleKey>> GetAllAsync();
        void Test(ScheduleKey value);
        void Del(int id);
        ScheduleKey Find(int id);
        ScheduleKey FindID(int id);
        ScheduleKeyData FindKey(int id);
    }

    public class ScheduleKeyDataRepository : IScheduleKeyDataRepository
    {
        private readonly string connString;
        public ScheduleKeyDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        //get from keys
        public async Task<IEnumerable<ScheduleKey>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<ScheduleKey>("SELECT ScheduleKeys.ScheduleKeyID, ScheduleKeys.ScheduleID, ScheduleKeys.KeyID" + 
                                                    " FROM ScheduleKeys" + 
                                                    " INNER JOIN Schedule ON Schedule.ScheduleID = ScheduleKeys.ScheduleID" + 
                                                    " INNER JOIN Keys ON Keys.KeyID = ScheduleKeys.KeyID");
            }
        }
        //post to keys
        public void Test(ScheduleKey value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO ScheduleKeys (ScheduleID, KeyID)"
                                + " VALUES(@ScheduleID,@KeyID)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }
        //delete from keys
        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM ScheduleKeys"
                            + " WHERE ScheduleKeyID = @ScheduleKeyID";
                conn.Open();
                conn.Execute(sQuery, new { ScheduleKeyID = id });
            }
        }
        //gets specific id
        public ScheduleKey Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT ScheduleKeys.ScheduleKeyID, ScheduleKeys.KeyID" +
                                                    " FROM ScheduleKeys" +
                                                    " INNER JOIN People ON Schedule.ScheduleID = ScheduleKeys.ScheduleID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = ScheduleKeys.KeyID" +
                                                    " WHERE ScheduleKeys.ScheduleID = @ScheduleID";
                conn.Open();
                return conn.Query<ScheduleKey>(sQuery, new { ScheduleKeyID = id }).FirstOrDefault();
            }
        }

        public ScheduleKey FindID(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT ScheduleKeys.ScheduleKeyID" +
                                                    " FROM ScheduleKeys" +
                                                    " INNER JOIN People ON Schedule.ScheduleID = ScheduleKeys.ScheduleID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = ScheduleKeys.KeyID" +
                                                    " WHERE ScheduleKeys.ScheduleID = @ScheduleID";
                conn.Open();
                return conn.Query<ScheduleKey>(sQuery, new { ScheduleID = id }).FirstOrDefault();
            }
        }

        public ScheduleKeyData FindKey(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT ScheduleKeys.ScheduleKeyID, ScheduleKeys.KeyID, Schedule.Times, Schedule.Days" +
                                                    " FROM ScheduleKeys" +
                                                    " INNER JOIN Schedule ON Schedule.ScheduleID = ScheduleKeys.ScheduleID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = ScheduleKeys.KeyID" +
                                                    " WHERE ScheduleKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<ScheduleKeyData>(sQuery, new { KeyID = id }).FirstOrDefault();
            }
        }
    }
}
