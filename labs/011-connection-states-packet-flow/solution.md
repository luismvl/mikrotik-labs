# Solucion

Respuestas representativas al cuestionario:

1. Estado de conexion del primer paquete SYN de una conexion TCP: `new`.
2. Estado de la respuesta ACK a una conexion existente: `established`.
3. Cadena que evalua paquetes destinados al propio router: `input`.
4. Cadena que evalua paquetes que atraviesan el router: `forward`.
5. El uso de `fasttrack` hace que el paquete omita queues, firewall adicional y otros procesos para reducir la carga de CPU.

Explicacion del flujo de paquetes:
- Un paquete entrante pasa primero por `prerouting`.
- Si esta destinado al router, se evalua en `input`.
- Si atraviesa el router, se evalua en `forward` y luego en `postrouting`.
- Los paquetes generados por el router pasan por `output` antes de `postrouting`.
