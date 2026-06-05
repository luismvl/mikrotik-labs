# Pistas

1. El servidor PPPoE requiere un perfil en `/ppp profile` y al menos un secreto en `/ppp secret`.
2. El servidor se habilita con `/interface pppoe-server server add`.
3. El cliente usa `/interface pppoe-client add` con `user`, `password` y `interface`.
4. Verifica que el servidor este escuchando en la interfaz correcta.
5. Si el cliente no conecta, revisa el log (`/log print`) para ver errores de autenticacion.
