# Contexto

Fasttrack es una optimizacion de RouterOS que permite a determinados paquetes omitir gran parte del procesamiento de firewall y queues, reduciendo la carga de CPU. Es util en routers con alto trafico de forwarding, pero tiene limitaciones que deben conocerse antes de aplicarlo.

# Objetivos

1. Crear una regla fasttrack para trafico `established` y `related`.
2. Verificar que fasttrack aparece en `/ip firewall filter print`.
3. Comprender que fasttrack omite queues y otras reglas de firewall.
4. Identificar escenarios donde fasttrack no debe usarse.

# Tareas

1. Conectate a r1.
2. Crea una regla `fasttrack-connection` para trafico `established` y `related` en la cadena `forward`.
3. Asegurate de que la regla `fasttrack` este antes de la regla de `accept` para el mismo trafico.
4. Verifica la configuracion con `/ip firewall filter print`.
5. Genera trafico de prueba y revisa si los contadores de fasttrack aumentan.
6. Reflexiona sobre que funcionalidades se verian afectadas si usas fasttrack (por ejemplo, queues, firewall adicional).

# Verificacion esperada

- `/ip firewall filter print` muestra una regla con `action=fasttrack-connection`.
- Los contadores de la regla fasttrack crecen al pasar trafico.
- El trafico entre LAN y cualquier destino sigue funcionando.

# Entrega

- Salida de `/ip firewall filter print`.
- Breve explicacion de las ventajas y limitaciones de fasttrack.
