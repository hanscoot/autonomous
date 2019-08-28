
using AutonomousBuilding.Models;
using Brainboxes.IO;
using System;

namespace AutonomousBuilding.Repositories
{
    public interface IBrainBoxRepository
    {
        void put(LockType id);
        void set(LockType id);
    }

    public class BrainBoxRepository : IBrainBoxRepository
    {
        private EDDevice GetDeviceType(string DeviceType, IConnection connection)
        {
            if (DeviceType == "ED-008")
            {
                return new Brainboxes.IO.ED008(connection);
            }
            else
            {
                throw new Exception("Unkown Device");
            }
        }

        public void put(LockType value)
        {
            using (IConnection connection = new TCPConnection(value.IP))
            {
                using (EDDevice ed = new ED008(connection))
                {
                    ed.Connect();
                    ed.Outputs[value.OutputPort].Value = 0;
                }
            }
        }
        public void set(LockType value)
        {
            using (IConnection connection = new TCPConnection(value.IP))
            {
                using (EDDevice ed = GetDeviceType(value.Type, connection))
                {
                    ed.Connect();
                    ed.Outputs[value.OutputPort].Value = 1;
                }
            }
        }
    }
}
