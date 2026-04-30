cd "C:\Users\zmoze\source\repos\SproutHub\SproutHub.Api"
dotnet publish -c Release -r linux-arm64 --self-contained false
scp C:\Users\zmoze\source\repos\SproutHub\SproutHub.Api\bin\Release\net8.0\linux-arm64\publish\* pi@zachspi:/home/pi/sprouthub-api
ssh pi@zachspi "sudo systemctl restart sprouthub-api"