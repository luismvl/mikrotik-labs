# Pistas

1. `new` se aplica al primer paquete de una conexion; `established` a los siguientes.
2. `related` incluye paquetes que pertenecen a una conexion secundaria (por ejemplo, FTP data).
3. `invalid` indica que el paquete no pertenece a ninguna conexion conocida o es inconsistente.
4. `fasttrack` se evalua en la cadena `forward` y omite gran parte del procesamiento posterior.
5. `input` se evalua para paquetes destinados al propio router; `output` para paquetes generados por el router.
