using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Models
{
    public class Locks
    {
        public int KeyID { get; set; }
        public string Name { get; set; }
        public int LockTypeID { get; set; }
        public int LockID { get; set; }
    }
}
