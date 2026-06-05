# Solution

La solucion esperada es justificar la decision de routing y no solamente lograr ping. En MTCRE debes demostrar que entiendes por que una ruta queda activa, por que otra queda en espera y como RouterOS selecciona el siguiente salto.

Comandos representativos:

```routeros
/ip/route/print detail
/routing/table/print
/tool/traceroute address=192.168.103.1
/ping 192.168.103.1 count=5
```


Para OSPF, confirma vecinos, LSDB y rutas instaladas:

```routeros
/routing/ospf/neighbor/print detail
/routing/ospf/lsa/print
/ip/route/print where protocol=ospf
```
