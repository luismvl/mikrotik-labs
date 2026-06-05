# Pistas

1. `/ping` soporta parametros como `count`, `size` e `interval` para controlar la prueba.
2. `/tool traceroute` usa paquetes UDP por defecto; puedes usar `protocol=icmp` para routers que bloquean UDP.
3. `/tool torch` muestra trafico en tiempo real por IP, protocolo o puerto. Puedes filtrar con `src-address` o `dst-address`.
4. `/tool netwatch` requiere `host`, `interval`, `type` (icmp por defecto). Los scripts `up-script` y `down-script` se ejecutan en el router local.
5. Si torch no muestra nada, asegurate de que el trafico pasa realmente por la interfaz que estas observando.
