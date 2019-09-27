using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Models
{
  public class ScriptResponse
  {
    public ScriptFile ScriptFile { get; set; }
    public DateTime ExecutedAt { get; set; }
    public string Sql { get; set; }
    public double Duration { get; set; }
    public bool Successful { get; set; }
    public string ErrorMessage { get; set; }
  }
}
