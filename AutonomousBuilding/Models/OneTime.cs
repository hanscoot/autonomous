using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Models
{
    public class OneTime
    {
        public int UserID { get; set; }
        public string LockID { get; set; }
        public string Time { get; set; }
        public string Date { get; set; }
        public int PersonID { get; set; }
        public int KeyID { get; set; }
    }
}
