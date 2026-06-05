# Solucion

Usar herramientas de diagnostico en RouterOS.

Comandos representativos:

En r1:
```
/ping 10.23.0.2 count=10

/tool traceroute 10.23.2.1 protocol=icmp

/tool torch ether2 src-mac=yes

/tool netwatch add host=10.23.0.2 interval=5s up-script=":log info \"Host r2 UP\"" down-script=":log info \"Host r2 DOWN\""

/log print
```

Generar trafico desde r2:
```
/ping 10.23.0.1 count=50 size=1400
```

Simular caida en r2:
```
/interface ethernet disable ether2
```

Recuperar en r2:
```
/interface ethernet enable ether2
```

Verificacion:
```
/tool netwatch print
/log print
```

Explicacion:
- `ping` verifica conectividad de capa 3.
- `traceroute` identifica cada salto en la ruta.
- `torch` analiza trafico en tiempo real por interfaz, protocolo, IP o puerto.
- `netwatch` monitorea hosts y ejecuta scripts automaticamente ante cambios de estado.
