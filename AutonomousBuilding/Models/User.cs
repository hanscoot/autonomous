using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Models
{
    public class User
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Number { get; set; }
        public bool Clear { get; set; }
        public string Token { get; set; }
    }
}
