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
    public interface IPersonKeyDataRepository
    {
        Task<IEnumerable<PersonKey>> GetAllAsync();
        Task<IEnumerable<KeyPerson>> GetAllasync();
        void Test(PersonKey value);
        PersonKey[] Tests();
        void Del(int id);
        KeyPerson Find(int id);
        KeyPerson GetPerson(int id);
        KeyPerson GetPersons(int id);
    }

    public class PersonKeyDataRepository : IPersonKeyDataRepository
    {
        private readonly string connString;
        public PersonKeyDataRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }
        //gets all
        public PersonKey[] Tests()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT PersonKeys.KeyID FROM PersonKeys";
                conn.Open();
                return conn.Query<PersonKey>(sQuery).Cast<PersonKey>().ToArray();
            }
        }

        //get from keys
        public async Task<IEnumerable<PersonKey>> GetAllAsync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<PersonKey>("SELECT PersonKeys.PersonKeyID, PersonKeys.PersonID, PersonKeys.KeyID" + 
                                                    " FROM PersonKeys" + 
                                                    " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" + 
                                                    " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID");
            }
        }
        //get from keys
        public async Task<IEnumerable<KeyPerson>> GetAllasync()
        {
            using (var conn = new SqlConnection(this.connString))
            {
                await conn.OpenAsync();
                return await conn.QueryAsync<KeyPerson>("SELECT People.Name, People.Temp, PersonKeys.KeyID, Keys.Content" +
                                                    " FROM PersonKeys" +
                                                    " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID");
            }
        }

        //post to keys
        public void Test(PersonKey value)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "INSERT INTO PersonKeys (PersonID, KeyID)"
                                + " VALUES(@PersonID,@KeyID)";
                conn.Open();
                conn.Execute(sQuery, value);
            }
        }
        //delete from keys
        public void Del(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "DELETE FROM PersonKeys"
                            + " WHERE KeyID = @KeyID";
                conn.Open();
                conn.Execute(sQuery, new { KeyID = id });
            }
        }
        //gets specific id
        public KeyPerson Find(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.Name, People.Temp, PersonKeys.KeyID, Keys.Content" +
                                                    " FROM PersonKeys" +
                                                    " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                                    " WHERE PersonKeys.PersonID = @PersonID";
                conn.Open();
                return conn.Query<KeyPerson>(sQuery, new { PersonID = id }).FirstOrDefault();
            }
        }

        public KeyPerson GetPerson(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.Name, PersonKeys.KeyID" +
                                                    " FROM PersonKeys" +
                                                    " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                                    " WHERE PersonKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<KeyPerson>(sQuery, new { KeyID = id }).FirstOrDefault();
            }
        }
        public KeyPerson GetPersons(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.Name, People.Temp, PersonKeys.KeyID, Keys.Content" +
                                                    " FROM PersonKeys" +
                                                    " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                                    " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                                    " WHERE PersonKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<KeyPerson>(sQuery, new { KeyID = id }).FirstOrDefault();
            }
        }
    }
}
