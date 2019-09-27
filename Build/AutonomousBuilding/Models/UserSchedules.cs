using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Models
{
    public class UserSchedules
    {
        public int KeyID { get; set; }
        public int ScheduleID { get; set; }
        public string Times { get; set; }
        public string Days { get; set; }
    }
}
