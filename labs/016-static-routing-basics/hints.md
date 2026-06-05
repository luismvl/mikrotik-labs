# Pistas

1. La ruta estatica necesita `dst-address` (la red destino) y `gateway` (la siguiente salto).
2. El gateway debe ser una direccion IP alcanzable directamente desde el router.
3. Si la ruta no aparece como activa, verifica que la interfaz del enlace este levantada.
4. Usa `/ip route print detail` para ver el estado completo de la ruta.
5. Asegurate de que las redes no se solapen entre si.
