using AutonomousBuilding.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Repositories
{
    public interface IPersonRepository
    {
        Task<IEnumerable<User>> GetUsers();
        User Find(string email);
        void Post(User value);
        void Delete(int id);
        void Edit(User value);
        User GetUser(int id);
    }

    public class PersonRepository : IPersonRepository
    {
        private readonly string connString;
        public PersonRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }
    
        public User Find(string email)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.PersonId, People.Name, People.Email, People.Password, People.Number FROM People" + " WHERE Email = @Email";
                conn.Open();
                return conn.Query<User>(sQuery, new { Email = email }).FirstOrDefault();
            }
        }
        
        public async Task<IEnumerable<User>> GetUsers()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<User>("SELECT People.PersonId, People.Name, People.Email, People.Number FROM People");
            }
        }

        public void Post(User value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO People (Name, Email, Number, Password)"
                                + " VALUES(@Name, @Email, @Number, @Password)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }

        public void Delete(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM People"
                            + " WHERE PersonId = @PersonId";
                conn.Open();
                conn.Execute(sQuery, new { PersonId = id });
            }
        }

        public void Edit(User value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "UPDATE People SET Name = @Name, Email = @Email, Number = @Number, Password = @Password"
                               + " WHERE PersonId = @PersonId";
                conn.Open();
                conn.Query(sQuery, value);
            }
        }

        public User GetUser(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.PersonId, People.Name, People.Email, People.Number FROM People"
                                + " WHERE PersonId = @PersonId";
                conn.Open();
                return conn.Query<User>(sQuery, new { PersonId = id }).FirstOrDefault();
            }
        }
    }
}
