# Solution

La solucion esperada es justificar la decision de routing y no solamente lograr ping. En MTCRE debes demostrar que entiendes por que una ruta queda activa, por que otra queda en espera y como RouterOS selecciona el siguiente salto.

Comandos representativos:

```routeros
/ip/route/print detail
/routing/table/print
/tool/traceroute address=192.168.103.1
/ping 192.168.103.1 count=5
```


Para rutas estaticas avanzadas, revisa distance, prefijo mas especifico, gateway y recursion:

```routeros
/ip/route/add dst-address=192.168.103.0/24 gateway=10.101.12.2 distance=1
/ip/route/print detail where dst-address=192.168.103.0/24
```
