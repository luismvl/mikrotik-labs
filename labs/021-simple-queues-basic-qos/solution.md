# Solucion

Configura simple queues en r1 para limitar trafico hacia r2 y la red intermedia.

Comandos representativos en r1:
```
/queue simple add name=limite-r2 target=10.21.0.2/32 max-limit=1M/2M

/queue simple add name=limite-red target=10.21.0.0/30 max-limit=512k/1M

/queue simple add name=limite-r2-dst target=10.21.0.1/32 dst=10.21.0.2/32 max-limit=1M/2M
```

Verificacion:
```
/queue simple print
/queue simple print detail
/queue simple print stats
```

Generar trafico desde r2:
```
/tool bandwidth-test address=10.21.0.1 protocol=tcp direction=both
```

O ping con payload:
```
/ping 10.21.0.1 size=1400 count=100
```

Explicacion:
- `target` define la entidad (IP, red, interfaz) a la que se aplica la queue.
- `dst` refina la queue para que solo aplique a trafico destinado a esa direccion.
- `max-limit` fija el techo de ancho de banda; `limit-at` (opcional) reserva un minimo.
- Las simple queues se procesan en orden; si una regla aplica, las siguientes pueden no ejecutarse dependiendo del parametro `priority` y el orden.
