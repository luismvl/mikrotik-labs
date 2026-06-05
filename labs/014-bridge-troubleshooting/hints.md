# Pistas

1. Revisa si el bridge esta habilitado (`/interface bridge print`).
2. Verifica si todos los puertos necesarios estan agregados al bridge.
3. Si un puerto esta en el bridge pero no hay hosts, revisa el cableado logico (en containerlab, las interfaces deben estar en el bridge correcto).
4. Comprueba que las direcciones IP estan en la misma red y asignadas a la interfaz correcta.
5. Usa `/interface bridge port print` para ver el estado de cada puerto.
