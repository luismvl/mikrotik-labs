# Solucion

Configura direcciones IP en interfaces y verifica conectividad.

Comandos representativos:
```
/interface print
/ip address add address=192.168.10.1/24 interface=ether2
/ip address print
/ip route print
/ping 192.168.10.2 count=4
```

Explicacion:
- Al asignar `192.168.10.1/24` a `ether2`, RouterOS crea automaticamente una ruta conectada para `192.168.10.0/24`.
- Si el cliente Linux tiene `192.168.10.2/24`, el ping deberia responder.

Verificacion:
```
/ip address print
/ip route print
```
