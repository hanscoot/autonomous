using System;
using System.Threading;
using Microsoft.Extensions.Options;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using System.Collections.Generic;

namespace AutonomousBuilding.service
{
    public interface IFileService
    {
        KeyPerson[] GetLockKey(int id);
        KeyPerson[] GetNotLockKey(int id);
        KeyPerson[] GetScheduleKey(int id);
        KeyPerson[] GetNotScheduleKey();
        KeyData[] GetNotPersonKey();
        KeyPerson[] GetKey();
        Class[] Gets(int id);
        string Get(string content, int day, string date);
        string Brain(int id);
    }

    public class FileService : IFileService
    {
        private readonly IAccountRepository accountRepository;
        private readonly IKeyDataRepository keyDataRepository;
        private readonly IOneTimeRepository oneTimeRepository;
        private readonly IBrainBoxRepository brainBoxRepository;
        private readonly ILockTypeRepository lockTypeRepository;
        private readonly ILockDataRepository lockDataRepository;
        private readonly ILockKeyDataRepository lockKeyDataRepository;
        private readonly IPersonKeyDataRepository personKeyDataRepository;
        private readonly IScheduleKeyDataRepository scheduleKeyDataRepository;

        public FileService(IOptions<AppSettings> appSettings, IAccountRepository accountRepository, ILockTypeRepository lockTypeRepository,
            IKeyDataRepository keyDataRepository, IOneTimeRepository oneTimeRepository, IBrainBoxRepository brainBoxRepository,
            ILockDataRepository lockDataRepository, ILockKeyDataRepository lockKeyDataRepository, IPersonKeyDataRepository personKeyDataRepository,
            IScheduleKeyDataRepository scheduleKeyDataRepository)
        {
            this.accountRepository = accountRepository;
            this.keyDataRepository = keyDataRepository;
            this.oneTimeRepository = oneTimeRepository;
            this.brainBoxRepository = brainBoxRepository;
            this.lockTypeRepository = lockTypeRepository;
            this.lockDataRepository = lockDataRepository;
            this.lockKeyDataRepository = lockKeyDataRepository;
            this.personKeyDataRepository = personKeyDataRepository;
            this.scheduleKeyDataRepository = scheduleKeyDataRepository;
        }
        //Gets all keys for a person (id = personID)
        public KeyPerson[] GetLockKey(int id)
        {
            var one = lockKeyDataRepository.Find(id);
            List<KeyPerson> list = new List<KeyPerson>();
            foreach (LockKey i in one)
            {
                var three = personKeyDataRepository.GetPerson(i.KeyID);
                if (three == null)
                {
                    KeyPerson user = new KeyPerson();
                    user.KeyID = i.KeyID;
                    user.Name = "Not Assigned";
                    list.Add(user);
                }
                else
                {
                    list.Add(three);
                }
            }
            KeyPerson[] output = list.ToArray();
            return output;
        }
        //Gets all keys
        public KeyPerson[] GetKey()
        {
            var one = keyDataRepository.Tests();
            List<KeyPerson> list = new List<KeyPerson>();
            foreach (KeyData i in one)
            {
                var three = personKeyDataRepository.GetPersons(i.KeyID);
                if (three == null)
                {
                    KeyPerson user = new KeyPerson();
                    user.KeyID = i.KeyID;
                    user.Content = i.Content;
                    user.Name = "Not Assigned";
                    list.Add(user);
                }
                else
                {
                    list.Add(three);
                }
            }
            KeyPerson[] output = list.ToArray();
            return output;
        }
        //Gets all keys for a schedule (id = ScheduleID)
        public KeyPerson[] GetScheduleKey(int id)
        {
            var one = scheduleKeyDataRepository.Find(id);
            List<KeyPerson> list = new List<KeyPerson>();
            foreach (ScheduleKey i in one)
            {
                var three = personKeyDataRepository.GetPerson(i.KeyID);
                if (three == null)
                {
                    KeyPerson user = new KeyPerson();
                    user.KeyID = i.KeyID;
                    user.Name = "Not Assigned";
                    list.Add(user);
                }
                else
                {
                    list.Add(three);
                }
            }
            KeyPerson[] output = list.ToArray();
            return output;
        }

        //Gets all keys not assigned to the lock(id = lockID)
        public KeyPerson[] GetNotLockKey(int id)
        {
            var zero = keyDataRepository.Tests();
            var one = lockKeyDataRepository.Find(id);
            List<KeyPerson> list = new List<KeyPerson>();
            foreach (KeyData i in zero)
            {
                int count = 0;
                foreach (LockKey j in one)
                {
                    if (j.KeyID == i.KeyID)
                    {
                        count++;
                    } 
                }
                if (count == 0)
                {
                    var three = personKeyDataRepository.GetPerson(i.KeyID);
                    if (three == null)
                    {
                        KeyPerson user = new KeyPerson();
                        user.KeyID = i.KeyID;
                        user.Name = "Not Assigned";
                        list.Add(user);
                    }
                    else
                    {
                        list.Add(three);
                    }
                }
            }
            KeyPerson[] output = list.ToArray();
            return output;
        }
        //Gets all keys not assigned to any schedule
        public KeyPerson[] GetNotScheduleKey()
        {
            var zero = keyDataRepository.Tests();
            var one = scheduleKeyDataRepository.Tests();
            List<KeyPerson> list = new List<KeyPerson>();
            foreach (KeyData i in zero)
            {
                int count = 0;
                foreach (ScheduleKey j in one)
                {
                    if (j.KeyID == i.KeyID)
                    {
                        count++;
                    }
                }
                if (count == 0)
                {
                    var three = personKeyDataRepository.GetPerson(i.KeyID);
                    if (three == null)
                    {
                        KeyPerson user = new KeyPerson();
                        user.KeyID = i.KeyID;
                        user.Name = "Not Assigned";
                        list.Add(user);
                    }
                    else
                    {
                        list.Add(three);
                    }
                }
            }
            KeyPerson[] output = list.ToArray();
            return output;
        }

        //Gets all keys not assigned to any person
        public KeyData[] GetNotPersonKey()
        {
            var zero = keyDataRepository.Tests();
            var one = personKeyDataRepository.Tests();
            List<KeyData> list = new List<KeyData>();
            foreach (KeyData i in zero)
            {
                int count = 0;
                foreach (PersonKey j in one)
                {
                    if (j.KeyID == i.KeyID)
                    {
                        count++;
                    }
                }
                if (count == 0)
                {
                    list.Add(i);
                }
            }
            KeyData[] output = list.ToArray();
            return output;
        }


        //Checks current key content 
        public Class[] Gets(int id)
        {
            List<Class> list = new List<Class>();
            List<Class> ting = new List<Class>();
            Class[] thing = ting.ToArray();
            var one = personKeyDataRepository.Find(id);
            if (one == null)
            {
                return thing;//deny (NO KEY FOR THAT USER)
            }
            else
            {
                var two = accountRepository.GetLocks(one.KeyID);
                if (two == null)
                {
                    return thing;//deny (NO LOCKS ASSIGNED TO KEY)
                }
                else
                {
                    var three = accountRepository.Get(one.KeyID); 
                    if (three == null)
                    {
                        var five = oneTimeRepository.GetUser(one.KeyID);
                        if (five == null)
                        {
                            return thing; //deny (NO SCHEDULES ASSIGNED TO KEY)
                        }
                        else
                        {
                            foreach (Locks i in two)
                            {
                                Class item = new Class();
                                item.KeyID = one.KeyID;
                                item.Times = five.Time;
                                item.Days = five.Date;
                                item.LockID = i.LockID;
                                item.LockTypeID = i.LockTypeID;
                                item.Name = i.Name;
                                list.Add(item);
                            }
                            Class[] output = list.ToArray();
                            return output;
                        }
                    }
                    else
                    {
                        foreach (Locks i in two)
                        {
                            Class item = new Class();
                            item.KeyID = one.KeyID;
                            item.ScheduleID = three.ScheduleID;
                            item.Times = three.Times;
                            item.Days = three.Days;
                            item.LockID = i.LockID;
                            item.LockTypeID = i.LockTypeID;
                            item.Name = i.Name;
                            list.Add(item);
                        }
                        Class[] output = list.ToArray();
                        return output;
                    }
                }
            }
        }


        
            //Checks current key content against the current date time
        public string Get(string content, int day, string date)
        {
            int id = 1; //can change to inputted value
            string[] weekDays = new string[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
            var one = keyDataRepository.Check(content);
            if (one == null)
            {
                return "zero";//deny (NO KEY EXISTS)
            }
            else
            {
                var two = accountRepository.GetLocks(one.KeyID);
                if (two == null)
                {
                    return "one";//deny (NO LOCKS ASSIGNED TO KEY)
                }
                else
                {
                    var three = accountRepository.Get(one.KeyID);
                    if (three == null)
                    {
                        var five = oneTimeRepository.GetUser(one.KeyID);
                        if (five == null)
                        {
                            return "two"; //deny (NO SCHEDULES ASSIGNED TO KEY)
                        }
                        else
                        {
                            var sttime = five.Time.Split("-");
                            var sstime = sttime[0].Split(":");
                            var s2time = sttime[1].Split(":");
                            var sdate = date.Split(" ")[0]; //calender date
                            var nstime = date.Split(" ")[1];
                            var stime = nstime.Split(":"); //split time
                            if ((Convert.ToInt32(stime[0]) > Convert.ToInt32(sstime[0])) || ((Convert.ToInt32(stime[0]) == Convert.ToInt32(sstime[0])) && (Convert.ToInt32(stime[1]) > Convert.ToInt32(sstime[1]))))
                            {
                                if ((Convert.ToInt32(stime[0]) < Convert.ToInt32(s2time[0])) || ((Convert.ToInt32(stime[0]) == Convert.ToInt32(s2time[0])) && (Convert.ToInt32(stime[1]) < Convert.ToInt32(s2time[1]))))
                                {
                                    if (sdate == five.Date)
                                    {
                                        Brain(id);
                                        return "four";//enabled
                                    }
                                    else
                                    {
                                        Brain(id);
                                        return "four";//deny (OUT OF HOURS)
                                    }
                                }
                                else
                                {
                                    return "three"; //deny (OUT OF HOURS)
                                }
                            }
                            else
                            {
                                return "three"; //deny (OUT OF HOURS)
                            }
                        }
                    }
                    else
                    {
                        var four = (three.Times).Split("-");
                        var ctime = four[0].Split(":");
                        var c2time = four[1].Split(":");
                        var nstime = date.Split(" ")[1];
                        var stime = nstime.Split(":");
                        //time later than start of interval
                        if ((Convert.ToInt32(stime[0]) > Convert.ToInt32(ctime[0])) || ((Convert.ToInt32(stime[0]) == Convert.ToInt32(ctime[0])) && (Convert.ToInt32(stime[1]) > Convert.ToInt32(ctime[1]))))
                        {   //time eariler than the end of interval
                            if ((Convert.ToInt32(stime[0]) < Convert.ToInt32(c2time[0])) || ((Convert.ToInt32(stime[0]) == Convert.ToInt32(c2time[0])) && (Convert.ToInt32(stime[1]) < Convert.ToInt32(c2time[1]))))
                            {   //valid days
                                if ((three.Days == "Mon-Sun") || ((three.Days == "Mon-Fri") && ((day != 6) || (day != 7))))
                                {
                                    Brain(id);
                                    return "four"; //enabled
                                }
                                else
                                {
                                    int count = 0;
                                    var days = three.Days.Split(", ");
                                    foreach (string i in days)
                                    {
                                        int index = Array.IndexOf(weekDays, i);
                                        if ((index + 1) == day)
                                        {
                                            count++;
                                            Brain(id);
                                            return "four"; //enabled
                                        }
                                    }
                                    if (count == 0)
                                    {
                                        return "three"; //deny (OUT OF HOURS)
                                    }
                                }
                            }
                            else
                            {
                                return "three"; //deny (OUT OF HOURS)
                            }
                        }
                        else
                        {
                            return "three"; //deny (OUT OF HOURS)
                        }
                    }
                }
            }
            return null;
        }
        //turns on/off the lock (id = lockID)
        public string Brain(int id)
        {
            var six = lockDataRepository.Find(id);
            var five = lockTypeRepository.Get(six.LockTypeID);
            brainBoxRepository.put(five);
            Thread.Sleep(five.Delay);
            brainBoxRepository.set(five);
            return "string";
        }
    }
}



