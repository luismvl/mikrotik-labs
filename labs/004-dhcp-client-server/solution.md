# Solucion

Configura cliente DHCP en WAN y servidor DHCP en LAN.

Comandos representativos:
```
/ip dhcp-client add interface=ether1 disabled=no

/ip pool add name=lan-pool ranges=192.168.20.10-192.168.20.100

/ip address add address=192.168.20.1/24 interface=ether2

/ip dhcp-server network add address=192.168.20.0/24 gateway=192.168.20.1 dns-server=8.8.8.8

/ip dhcp-server add name=dhcp-lan interface=ether2 address-pool=lan-pool disabled=no
```

Verificacion:
```
/ip dhcp-client print
/ip dhcp-server print
/ip dhcp-server lease print
```

En el cliente Linux:
```
ip addr show eth1
```
Debe mostrar una IP dentro del pool.
