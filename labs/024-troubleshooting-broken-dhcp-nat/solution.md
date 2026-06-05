# Solucion

Errores intencionales y correcciones:

1. **Red DHCP incorrecta**: `/ip dhcp-server network` apuntaba a `10.24.20.0/24` en lugar de `10.24.10.0/24`.
   - Correccion: eliminar la red incorrecta y crear la correcta.
   ```
   /ip dhcp-server network remove [find address=10.24.20.0/24]
   /ip dhcp-server network add address=10.24.10.0/24 gateway=10.24.10.1 dns-server=8.8.8.8
   ```

2. **Firewall bloquea ICMP**: reglas `drop` en `forward` e `input` para ICMP impiden la prueba de conectividad.
   - Correccion: deshabilitar o eliminar las reglas de bloqueo ICMP.
   ```
   /ip firewall filter disable [find comment="block icmp"]
   ```

3. **NAT masquerade**: aunque apuntaba a `ether2`, en este caso la salida real es `ether2` hacia r1. El problema principal era el DHCP y el firewall. Si el NAT apuntara a `ether3`, tambien seria un error.

Verificacion:
```
/ip dhcp-server lease print
/ip firewall nat print
/ip firewall filter print
```

Desde el cliente:
```
ip addr show eth1
ping -c 4 10.24.10.1
ping -c 4 10.24.0.1
```

Explicacion:
- El troubleshooting sistematico avanza por capas: fisico (cables), capa 2 (ARP), capa 3 (IP, DHCP, rutas), capa 4+ (firewall, NAT).
- En este caso, la capa 3 fallaba por la red DHCP mal configurada, y la capa 4+ por el firewall que bloqueaba ICMP.
