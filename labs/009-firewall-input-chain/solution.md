# Solucion

Aplicar reglas de firewall en la cadena input para proteger el router.

Comandos representativos:
```
/ip firewall filter add chain=input connection-state=established,related action=accept comment="accept established,related"

/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=192.168.77.0/24 action=accept comment="allow SSH from LAN"

/ip firewall filter add chain=input protocol=tcp dst-port=8291 src-address=192.168.77.0/24 action=accept comment="allow WinBox from LAN"

/ip firewall filter add chain=input in-interface=ether1 action=drop comment="drop all from WAN"
```

Verificacion:
```
/ip firewall filter print
/ip firewall filter print stats
```

Explicacion:
- La primera regla evita que se bloqueen respuestas a conexiones salientes.
- Las siguientes abren puertos de gestion solo para la LAN.
- La ultima regla descarta todo lo que entre por WAN, protegiendo el router de accesos externos no autorizados.
