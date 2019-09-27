using Brainboxes.IO;
using System;

namespace AutonomousBuilding.Repositories
{
    public interface IBrainBoxInputRepository
    {
        string Put();
    }

    public class BrainBoxInputRepository : IBrainBoxInputRepository
    {

        public string Put()
        {
            ESDevice es = new ES257("192.168.2.157", 9002, 10000);
            Console.WriteLine("Connecting to " + es);
            es.Connect();
            string recievedData = es.Ports[1].Receive();

            return recievedData;
            //connect method opens all serial ports of the device, an es-246 only has 1 port
            /*es.Connect();
            string recievedData = es.Ports[1].Receive();
            while (recievedData == null)
            {
                recievedData = es.Ports[1].Receive();
            }
            if (recievedData != null)
            {
                es.Disconnect();
            }
            Console.WriteLine("Received DATA : " + recievedData);
            return recievedData;*/
        }
    }
}

