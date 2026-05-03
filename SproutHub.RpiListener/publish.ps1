cd "C:\Users\zmoze\source\repos\SproutHub\SproutHub.RpiListener"
dotnet publish -c Release -r linux-arm64 --self-contained false
scp C:\Users\zmoze\source\repos\SproutHub\SproutHub.RpiListener\bin\Release\net8.0\linux-arm64\publish\* pi@zachspi:/home/pi/sprouthub-rpi-listener
ssh pi@zachspi "sudo systemctl restart sprouthub-rpi-listener"