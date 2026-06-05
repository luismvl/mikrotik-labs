# Solucion

Aplicar reglas de firewall en la cadena forward para filtrar trafico entre redes.

Comandos representativos:
```
/ip firewall filter add chain=forward connection-state=established,related action=accept comment="accept established,related"

/ip firewall filter add chain=forward src-address=192.168.10.0/24 action=accept comment="allow LAN to any"

/ip firewall filter add chain=forward in-interface=ether1 connection-state=new action=drop comment="drop new from WAN"

/ip firewall filter add chain=forward protocol=icmp action=drop comment="drop ICMP (optional)"
```

Verificacion:
```
/ip firewall filter print
/ip firewall filter print stats
```

Explicacion:
- La primera regla acepta respuestas a conexiones iniciadas desde la LAN.
- La segunda permite que la LAN comunique con cualquier destino.
- La tercera descarta conexiones nuevas que entren desde WAN, protegiendo la LAN.
- El orden garantiza que el trafico legitimo no sea bloqueado.
