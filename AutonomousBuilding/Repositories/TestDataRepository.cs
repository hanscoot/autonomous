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
    public interface ITestDataRepository
    {
        Task<IEnumerable<TestData>> GetAllAsync();
        void Test(TestData value);
        void Del(int id);
        void Edit(TestData value);
        TestData Find(int id);
    }

    public class TestDataRepository : ITestDataRepository
    {
        private readonly string connString;
        public TestDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        public async Task<IEnumerable<TestData>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<TestData>("select * from [People]");
            }
        }
    
        public void Test(TestData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO People (Name, Email, Number, Deleted, Password)"
                                + " VALUES(@Name, @Email, @Number, @Deleted, @Password)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }

        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM People"
                            + " WHERE PersonId = @PersonId";
                conn.Open();
                conn.Execute(sQuery, new { PersonId = id });
            }
        }

        public void Edit(TestData value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "UPDATE People SET Name = @Name, Email = @Email, Number = @Number, Deleted = @Deleted, Password = @Password"
                               + " WHERE PersonId = @PersonId";
                conn.Open();
                conn.Query(sQuery, value);
            }
        }

        public TestData Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT * FROM People" + " WHERE PersonId = @PersonId";
                conn.Open();
                return conn.Query<TestData>(sQuery, new { PersonId = id }).FirstOrDefault();
            }
        }
    }
}
