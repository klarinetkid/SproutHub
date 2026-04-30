$piUser = "pi"
$piHost = "zachspi"
$remoteTemp = "/home/pi/sprouthub.client/"
$remoteSite = "/var/www/sprouthub"

ssh "$piUser@${piHost}" "rm -rf $remoteTemp && mkdir -p $remoteTemp"

npm run build
scp -r .\dist\* "$piUser@${piHost}:/home/pi/sprouthub.client/"

# && sudo find $remoteSite -type d -exec chmod 755 {} \; && sudo find $RemoteSite -type f -exec chmod 644 {} \;
ssh "$piUser@${piHost}" "sudo mkdir -p $remoteSite && sudo rm -rf $remoteSite/* && sudo cp -r $remoteTemp/* $remoteSite/ && sudo chown -R www-data:www-data $remoteSite"