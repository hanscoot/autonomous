namespace AutonomousBuilding.Models
{
  public class LockType
  {
    public int LockTypeID { get; set; }
    public string Type { get; set; }
    public string IP { get; set; }
    public int OutputPort { get; set; }
    public int InputPort { get; set; }
    public int Delay { get; set; }
  }
}
