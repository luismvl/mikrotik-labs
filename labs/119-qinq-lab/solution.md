# Solution

La solucion esperada es justificar la decision de routing y no solamente lograr ping. En MTCRE debes demostrar que entiendes por que una ruta queda activa, por que otra queda en espera y como RouterOS selecciona el siguiente salto.

Comandos representativos:

```routeros
/ip/route/print detail
/routing/table/print
/tool/traceroute address=192.168.103.1
/ping 192.168.103.1 count=5
```


Para VLAN/QinQ, confirma bridge VLAN table y puertos tagged/untagged:

```routeros
/interface/bridge/port/print detail
/interface/bridge/vlan/print detail
/interface/vlan/print detail
```
