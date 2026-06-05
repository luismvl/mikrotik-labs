# Solucion

Activar fasttrack para trafico established y related en la cadena forward.

Comandos representativos:
```
/ip firewall filter add chain=forward connection-state=established,related action=fasttrack-connection comment="fasttrack established,related"

/ip firewall filter add chain=forward connection-state=established,related action=accept comment="accept established,related"
```

Verificacion:
```
/ip firewall filter print
/ip firewall filter print stats
```

Explicacion:
- Fasttrack marca las conexiones para que los paquetes subsiguientes omitan procesamiento adicional.
- Esto reduce el uso de CPU en routers con mucho trafico de forwarding.
- Sin embargo, fasttrack hace que los paquetes no pasen por queues ni por reglas de firewall adicionales.
- No usar fasttrack si se requiere control de ancho de banda o inspeccion adicional sobre trafico establecido.
