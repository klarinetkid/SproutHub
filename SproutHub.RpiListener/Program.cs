using System.IO.Ports;

namespace SproutHub.RpiListener
{
    internal class Program
    {
        private static int dryValue = 450;
        private static int wetValue = 120;

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
                double pct = Math.Round(moisturePercent(reading), 2);

                var content = new FormUrlEncodedContent([
                    new KeyValuePair<string, string>("PlantId", plantId.ToString()),
                    new KeyValuePair<string, string>("MoistureReading", pct.ToString())
                ]);
                await client.PostAsync("http://localhost:5000/api/readings", content);

                string body = $"PlantId={plantId}&MoistureReading={pct}";
                Console.WriteLine(body);
            }
        }

        private static double moisturePercent(int reading)
        {
            double raw = Math.Min(Math.Max(reading, wetValue), dryValue);
            return (raw - dryValue) * (100.0) / (wetValue - dryValue);
        }
    }
}
