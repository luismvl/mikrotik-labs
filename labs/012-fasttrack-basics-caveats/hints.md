# Pistas

1. La regla fasttrack debe estar lo mas arriba posible en la cadena `forward`.
2. Despues de fasttrack, se necesita una regla `accept` para el mismo trafico `established,related`.
3. Fasttrack solo funciona si el connection tracking esta activado (por defecto lo esta).
4. Fasttrack evita que los paquetes pasen por queues, por lo que no se puede aplicar junto con limitacion de ancho de banda.
5. No usar fasttrack si se necesitan reglas de firewall adicionales sobre trafico establecido.
