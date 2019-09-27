using System;
using System.Threading;
using Microsoft.Extensions.Options;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;

namespace AutonomousBuilding.service
{
    public interface IFileService
    {
        string Get(string content, int day, string date);
        string Brain();
    }

    public class FileService : IFileService
    {
        private readonly IAccountRepository accountRepository;
        private readonly IKeyDataRepository keyDataRepository;
        private readonly IOneTimeRepository oneTimeRepository;
        private readonly IBrainBoxRepository brainBoxRepository;
        private readonly ILockTypeRepository lockTypeRepository;
        private readonly ILockDataRepository lockDataRepository;

        public FileService(IOptions<AppSettings> appSettings, IAccountRepository accountRepository, ILockTypeRepository lockTypeRepository,
            IKeyDataRepository keyDataRepository, IOneTimeRepository oneTimeRepository, IBrainBoxRepository brainBoxRepository,
            ILockDataRepository lockDataRepository)
        {
            this.accountRepository = accountRepository;
            this.keyDataRepository = keyDataRepository;
            this.oneTimeRepository = oneTimeRepository;
            this.brainBoxRepository = brainBoxRepository;
            this.lockTypeRepository = lockTypeRepository;
            this.lockDataRepository = lockDataRepository;
        }

        public string Get(string content, int day, string date)
        {
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
                                        Brain();
                                        return "four";//enabled
                                    }
                                    else
                                    {
                                        Brain();
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
                                    Brain();
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
                                            Brain();
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
        public string Brain()
        {
            var id = 1;
            var six = lockDataRepository.Find(id);
            var five = lockTypeRepository.Get(six.LockTypeID);
            brainBoxRepository.set(five);
            Thread.Sleep(five.Delay);
            brainBoxRepository.put(five);
            return "string";
        }
    }
}



