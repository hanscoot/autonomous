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
    public interface ILockTypeRepository
    {
        Task<IEnumerable<LockType>> GetAllAsync();
        void Test(LockType value);
        void Del(int id);
        void Edit(LockType value);
        LockType Get(int id);
    }

    public class LockTypeRepository : ILockTypeRepository
    {
        private readonly string connString;
        public LockTypeRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        //get from locks
        public async Task<IEnumerable<LockType>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<LockType>("select * from [LockType]");
            }
        }
        //post to locks
        public void Test(LockType value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO LockType (OutputType, OutputIP, OutputPort, InputType, InputIP, InputPort, Delay)"
                                + " VALUES(@OutputType, @OutputIP, @OutputPort, @InputType, @InputIP, @InputPort, @Delay)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }
        //delete from locks
        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM LockType"
                            + " WHERE LockTypeID = @LockTypeID";
                conn.Open();
                conn.Execute(sQuery, new { LockTypeID = id });
            }
        }
        //edit locks
        public void Edit(LockType value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "UPDATE LockType SET OutputType = @OutputType, OutputIP = @OutputIP, OutputPort = @OutputPort, Delay = @Delay, InputType = @InputType, InputIP = @InputIP, InputPort = @InputPort"
                               + " WHERE LockTypeID = @LockTypeID";
                conn.Open();
                conn.Query(sQuery, value);
            }
        }

        public LockType Get(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM LockType" + " WHERE LockTypeID = @LockTypeID";
                conn.Open();
                return conn.Query<LockType>(sQuery, new { LockTypeID = id }).FirstOrDefault();
            }
        }
    }
}
