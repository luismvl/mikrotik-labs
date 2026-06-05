# Solucion

Configuracion completa del laboratorio integrado.

## r1

```
/ip address print
/ip route add dst-address=10.27.10.0/24 gateway=10.27.0.2

/ping 10.27.0.2 count=10
```

## r2

```
/ip address add address=10.27.10.1/24 interface=ether3

/ip pool add name=client-pool ranges=10.27.10.10-10.27.10.100

/ip dhcp-server network add address=10.27.10.0/24 gateway=10.27.10.1 dns-server=8.8.8.8

/ip dhcp-server add name=dhcp-client interface=ether3 address-pool=client-pool disabled=no

/ip firewall nat add chain=srcnat action=masquerade out-interface=ether2

/ip firewall filter add chain=input action=accept connection-state=established,related
/ip firewall filter add chain=input action=accept protocol=icmp
/ip firewall filter add chain=input action=drop

/ip firewall filter add chain=forward action=accept connection-state=established,related
/ip firewall filter add chain=forward action=accept src-address=10.27.10.0/24 dst-address=10.27.0.0/30
/ip firewall filter add chain=forward action=drop

/queue simple add name=limit-client target=10.27.10.0/24 max-limit=2M/4M

/tool netwatch add host=10.27.0.1 interval=5s

/tool torch ether3
```

## Cliente

```
udhcpc -i eth1
ip addr show eth1

ping -c 4 10.27.10.1
ping -c 4 10.27.0.2
ping -c 4 10.27.0.1
```

## Verificacion

```
/ip dhcp-server lease print
/ip firewall filter print
/queue simple print
/queue simple print stats
/tool netwatch print
```

Explicacion:
- Este lab integra los temas principales del MTCNA: IP, rutas, DHCP, NAT, firewall, queues y herramientas.
- La secuencia recomendada es configurar capa 3 (IP, rutas), capa 4+ (DHCP), traduccion de direcciones (NAT), seguridad (firewall) y control de trafico (queues).
