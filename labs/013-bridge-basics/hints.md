# Pistas

1. Un bridge actua como un switch virtual; los puertos agregados comparten el mismo dominio de broadcast.
2. La direccion IP debe asignarse al bridge, no a las interfaces fisicas individuales.
3. Si no ves hosts en la tabla, verifica que los puertos estan agregados y que el bridge esta habilitado.
4. Asegurate de que los clientes tienen direcciones IP en la misma red.
5. Usa `/interface bridge port print` para confirmar que los puertos pertenecen al bridge correcto.
