# Solucion

Configurar rutas estaticas entre dos routers para alcanzar redes no directamente conectadas.

Comandos representativos:

En r1:
```
/ip route add dst-address=172.16.0.0/24 gateway=10.16.0.2
```

En r2:
```
/ip route add dst-address=192.168.16.0/24 gateway=10.16.0.1
```

Verificacion:
```
/ip route print
/ping 172.16.0.1
```

Explicacion:
- La ruta estatica indica al router que para alcanzar la red destino debe enviar los paquetes al gateway.
- El gateway debe estar en una red directamente conectada.
- RouterOS marca la ruta como activa si el gateway es alcanzable.
