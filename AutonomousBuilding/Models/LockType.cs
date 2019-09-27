namespace AutonomousBuilding.Models
{
  public class LockType
  {
    public int LockTypeID { get; set; }
    public string OutputType { get; set; }
    public string OutputIP { get; set; }
    public int OutputPort { get; set; }
    public string InputType { get; set; }
    public string InputIP { get; set; }
    public int InputPort { get; set; }
    public int Delay { get; set; }
  }
}
