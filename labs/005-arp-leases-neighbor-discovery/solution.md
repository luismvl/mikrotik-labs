# Solucion

Gestion de leases, ARP y descubrimiento de vecinos.

Comandos representativos:
```
/ip dhcp-server lease print
/ip dhcp-server lease make-static [find address=192.168.20.10]

/ip arp add address=192.168.20.10 mac-address=XX:XX:XX:XX:XX:XX interface=ether2

/ip neighbor discovery-settings set discover-interface-list=LAN
/interface list add name=LAN
/interface list member add list=LAN interface=ether2

/ip neighbor print
```

Nota: la MAC real del cliente la obtienes del lease DHCP.

Verificacion:
```
/ip dhcp-server lease print where dynamic=no
/ip arp print
/ip neighbor print
```
