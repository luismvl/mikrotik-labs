# Solucion

Redireccion de DNS y dstNAT hacia servicios internos.

Comandos representativos:
```
/ip dns set servers=8.8.8.8,1.1.1.1 allow-remote-requests=yes

/ip firewall nat add chain=dstnat protocol=udp dst-port=53 action=redirect to-ports=53
/ip firewall nat add chain=dstnat protocol=tcp dst-port=53 action=redirect to-ports=53

/ip dhcp-server network set [find] dns-server=192.168.50.1
```

Verificacion:
```
/ip firewall nat print
/ip dns cache print
```

En el cliente Linux:
```
nslookup google.com 192.168.50.1
```

Para publicar un servicio interno (ejemplo opcional):
```
/ip firewall nat add chain=dstnat dst-port=8080 protocol=tcp action=dst-nat to-addresses=192.168.50.10 to-ports=80
```
