# Contexto

ARP, leases estaticos y el descubrimiento de vecinos son herramientas fundamentales para conocer y controlar los dispositivos conectados a una red local. Este laboratorio combina DHCP, ARP y MNDP para una vision completa.

# Objetivos

1. Convertir un lease DHCP dinamico en estatico (make-static).
2. Configurar una entrada ARP estatica asociada al lease.
3. Habilitar y verificar el descubrimiento de vecinos en las interfaces.
4. Revisar la tabla de vecinos con `/ip neighbor print`.

# Tareas

1. Despliega el laboratorio. Asegurate de que el cliente Linux obtenga una IP por DHCP (como en el lab 004).
2. Revisa los leases dinamicos con `/ip dhcp-server lease print`.
3. Convierte el lease del cliente Linux a estatico usando `make-static`.
4. Asocia una entrada ARP estatica a esa IP/MAC en la interfaz LAN.
5. Habilita el neighbor discovery (MNDP) en `ether2`.
6. Espera unos segundos y revisa `/ip neighbor print`.
7. Verifica que el cliente Linux aparece con su IP y MAC.

# Verificacion esperada

- El lease del cliente aparece como estatico (E flag o similar).
- `/ip arp print` muestra una entrada estatica para la IP del cliente.
- `/ip neighbor print` muestra al menos una entrada para el cliente Linux.

# Entrega

- Salida de `/ip dhcp-server lease print`.
- Salida de `/ip arp print`.
- Salida de `/ip neighbor print`.
