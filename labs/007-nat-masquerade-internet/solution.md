# Solucion

Configura NAT masquerade para permitir salida a Internet desde la LAN.

Comandos representativos en r1:
```
/ip address add address=10.0.0.1/30 interface=ether1
/ip route add dst-address=0.0.0.0/0 gateway=10.0.0.2

/ip firewall nat add chain=srcnat action=masquerade out-interface=ether1
```

En r2 (simula ISP):
```
/ip address add address=10.0.0.2/30 interface=ether2
```

Verificacion:
```
/ip firewall nat print
/ip route print
/ip firewall connection print
```

En el cliente Linux:
```
ping 10.0.0.2
```

El ping debe responder, confirmando que el trafico atraviesa r1 con masquerade.
