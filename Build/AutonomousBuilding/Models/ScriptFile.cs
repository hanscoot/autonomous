using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.Models
{
  public class ScriptFile
  {
    public string Type { get; set; }
    public int Seq { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
  }
}
