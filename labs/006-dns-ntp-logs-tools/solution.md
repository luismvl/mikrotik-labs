# Solucion

Configuracion de DNS cache, cliente NTP y herramientas de diagnostico.

Comandos representativos:
```
/ip dns set servers=8.8.8.8,1.1.1.1 allow-remote-requests=yes

/system ntp client set enabled=yes servers=pool.ntp.org

/system clock print

/ip dns resolve pool.ntp.org

/log print

/ping 8.8.8.8 count=4

/tool traceroute 8.8.8.8
```

Verificacion:
```
/ip dns print
/system ntp client print
/log print
```

Explicacion:
- `allow-remote-requests=yes` activa el cache DNS local.
- El cliente NTP sincroniza el reloj del sistema.
- Las herramientas de red permiten diagnosticar conectividad.
