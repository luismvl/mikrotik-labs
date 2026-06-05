# Pistas

1. `allow-remote-requests` permite que los clientes de la LAN usen el router como DNS; asegurate de aplicar NAT o firewall si abres el puerto 53.
2. El cliente NTP en RouterOS requiere habilitarlo y especificar un servidor.
3. Si no tienes conectividad a Internet, el NTP puede no sincronizar; en este laboratorio es suficiente con verificar que el cliente esta configurado.
4. `/tool traceroute` es el equivalente a traceroute en RouterOS.
5. Los logs se pueden filtrar por topico con `/log print where topics~"ntp"`.
