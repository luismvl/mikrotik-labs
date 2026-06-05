# Solution

La solucion esperada es justificar la decision de routing y no solamente lograr ping. En MTCRE debes demostrar que entiendes por que una ruta queda activa, por que otra queda en espera y como RouterOS selecciona el siguiente salto.

Comandos representativos:

```routeros
/ip/route/print detail
/routing/table/print
/tool/traceroute address=192.168.103.1
/ping 192.168.103.1 count=5
```


Para policy routing, separa la tabla, la regla y el trafico que debe entrar a esa tabla:

```routeros
/routing/table/add name=to-wan2 fib
/routing/rule/print detail
/ip/firewall/mangle/print detail
```
