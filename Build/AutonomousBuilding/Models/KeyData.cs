namespace AutonomousBuilding.Models
{
    public class KeyData
    {
        public int KeyID { get; set; }
        public int TypeID { get; set; }
        public string Content { get; set; }

        public KeyType KeyType
        {
            get
            {
                return (KeyType)this.TypeID;
            }

            set
            {
                this.TypeID = (int)value;
            }
        }
    }
}
