using System.IO.Ports;

namespace SproutHub.RpiListener
{
    internal class Program
    {
        private static readonly HttpClient client = new HttpClient();

        static async Task Main(string[] args)
        {
            var port = new SerialPort("/dev/ttyACM0", 9600)
            {
                NewLine = "\n"
            };

            port.Open();

            while (true)
            {
                string line = port.ReadLine().Trim();

                if (!line.StartsWith("|") && line.EndsWith("|")) continue;

                line = line.Trim('|');

                string[] split = line.Split("|");
                if (split.Length != 2) break;

                int plantId = int.Parse(split[0]);
                int reading = int.Parse(split[1]);

                var content = new FormUrlEncodedContent([
                    new KeyValuePair<string, string>("PlantId", plantId.ToString()),
                    new KeyValuePair<string, string>("RawValue", reading.ToString())
                ]);
                await client.PostAsync("http://localhost:5000/api/readings", content);

                string body = $"PlantId={plantId}&RawValue={reading}";
                Console.WriteLine(body);
            }
        }
    }
}
