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
        UserSchedules Get(int id);
        UserSchedules[] Getsch(int id);
        UserKeys GetKey(int id);
        UserKeys[] GetKeys(int id);
        UserLocks[] GetLock(int id);
        UserInfo GetUser(int id);
        UserName GetUsername(int id);
        UserLocks[] GetKeyLock(int id);
        QR GetUKey(int id);
        Locks[] GetLocks(int id);

    }

    public class AccountRepository : IAccountRepository
    {
        private readonly string connString;
        public AccountRepository(IConfiguration config)
        {
            this.connString = config.GetConnectionString("default");
        }

        public UserSchedules Get(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT Keys.KeyID, Schedule.ScheduleID, Schedule.Times, Schedule.Days FROM ScheduleKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = ScheduleKeys.KeyID" +
                                " INNER JOIN Schedule ON Schedule.ScheduleID = ScheduleKeys.ScheduleID" +
                                " WHERE ScheduleKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<UserSchedules>(sQuery, new { KeyID = id }).FirstOrDefault();
            }
        }

        public UserSchedules[] Getsch(int id)
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

        public UserKeys GetKey(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.PersonId, Keys.KeyID FROM PersonKeys" + 
                                " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                " WHERE PersonKeys.PersonID = @PersonID";
                conn.Open();
                return conn.Query<UserKeys>(sQuery, new { PersonID = id }).FirstOrDefault();
            }
        }
        public UserKeys[] GetKeys(int id)
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

        public UserName GetUsername(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.Name, People.Temp, Keys.KeyID FROM PersonKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                " WHERE PersonKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<UserName>(sQuery, new { KeyID = id }).FirstOrDefault();
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

        public UserInfo GetUser(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.Name, People.Email, People.Number FROM People" +
                                " WHERE People.PersonId = @PersonId";
                conn.Open();
                return conn.Query<UserInfo>(sQuery, new { PersonId = id }).FirstOrDefault();
            }
        }

        public UserLocks[] GetKeyLock(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT Keys.KeyID, Locks.Name FROM LockKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID" +
                                " INNER JOIN Locks ON Locks.LockID = LockKeys.LockID" +
                                " WHERE LockKeys.LockID = @LockID";
                conn.Open();
                return conn.Query<UserLocks>(sQuery, new { LockID = id }).Cast<UserLocks>().ToArray();
            }
        }

        public QR GetUKey(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT People.PersonId, Keys.KeyID, Keys.Content FROM PersonKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = PersonKeys.KeyID" +
                                " INNER JOIN People ON People.PersonId = PersonKeys.PersonID" +
                                " WHERE PersonKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<QR>(sQuery, new { KeyID = id }).FirstOrDefault();
            }
        }
        public Locks[] GetLocks(int id)
        {
            using (var conn = new SqlConnection(this.connString))
            {
                string sQuery = "SELECT Keys.KeyID, Locks.Name, Locks.LockTypeID, Locks.LockID FROM LockKeys" +
                                " INNER JOIN Keys ON Keys.KeyID = LockKeys.KeyID" +
                                " INNER JOIN Locks ON Locks.LockID = LockKeys.LockID" +
                                " WHERE LockKeys.KeyID = @KeyID";
                conn.Open();
                return conn.Query<Locks>(sQuery, new { KeyID = id }).Cast<Locks>().ToArray();
            }
        }
    }
}
