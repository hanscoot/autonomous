using AutonomousBuilding.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Repositories
{
    public interface IAccountRepository
    {
        UserSchedules[] Get(int id);
        UserKeys[] GetKey(int id);
        UserLocks[] GetLock(int id);
    }

    public class AccountRepository : IAccountRepository
    {
        private readonly string connString;
        public AccountRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        public UserSchedules[] Get(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT Keys.KeyID, Schedule.ScheduleID, Schedule.Times, Schedule.Days FROM ScheduleKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = ScheduleKeys.KeyID" +
                                " INNER JOIN Schedule ON Schedule.ScheduleID = ScheduleKeys.ScheduleID" +
                                " WHERE ScheduleKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<UserSchedules>(sQuery, new { KeyID = id }).Cast<UserSchedules>().ToArray();
            }
        }

        public UserKeys[] GetKey(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.PersonId, Keys.KeyID FROM PersonKeys" + 
                                " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                " WHERE PersonKeys.PersonID = @PersonID";
                conn.Open();
                return conn.Query<UserKeys>(sQuery, new { PersonID = id }).Cast<UserKeys>().ToArray();
            }
        }

        public UserLocks[] GetLock(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT Keys.KeyID, Locks.Name FROM LockKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID" +
                                " INNER JOIN Locks ON Locks.LockID = LockKeys.LockID" +
                                " WHERE LockKeys.KeyID = @KeyID";
                conn.Open();                
                return conn.Query<UserLocks>(sQuery, new { KeyID = id }).Cast<UserLocks>().ToArray();
            }
        }


    }
}
