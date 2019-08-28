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
    public interface IScheduleDataRepository
    {
        Task<IEnumerable<ScheduleData>> GetAllAsync();
        void Test(ScheduleData value);
        void Del(int id);
        void Edit(ScheduleData value);
        ScheduleData Find(int id);
    }

    public class ScheduleDataRepository : IScheduleDataRepository
    {
        private readonly string connString;
        public ScheduleDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        public async Task<IEnumerable<ScheduleData>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<ScheduleData>("select * from [Schedule]");
            }
        }
    
        public void Test(ScheduleData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO Schedule (Times, Days, Number)"
                                + " VALUES(@Times, @Days, @Number)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }

        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM Schedule"
                            + " WHERE ScheduleID = @ScheduleID";
                conn.Open();
                conn.Execute(sQuery, new { ScheduleID = id });
            }            
        }

        public void Edit(ScheduleData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "UPDATE Schedule SET Times = @Times, Days = @Days, Number = @Number"
                               + " WHERE ScheduleID = @ScheduleID";
                conn.Open();
                conn.Query(sQuery, value);
            }
        }

        public ScheduleData Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM Schedule" + " WHERE ScheduleID = @ScheduleID";
                conn.Open();
                return conn.Query<ScheduleData>(sQuery, new { ScheduleID = id }).FirstOrDefault();
            }
        }
    }
}
