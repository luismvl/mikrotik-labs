# Contexto

En este escenario de troubleshooting, un cliente conectado a r2 no obtiene direccion IP ni tiene acceso a Internet. La configuracion inicial tiene errores intencionales en el servidor DHCP, la red DHCP y el NAT masquerade. Debes aplicar un metodo sistematico de diagnostico para identificar la causa raiz y corregirla.

# Objetivos

1. Identificar si un cliente no obtiene IP por problemas de servidor, pool o red DHCP.
2. Detectar errores en la regla NAT masquerade o en el srcnat.
3. Verificar conectividad paso a paso (capa 1, 2, 3) y resolver el problema.
4. Documentar la causa raiz y la solucion aplicada.

# Tareas

1. Conectate al contenedor cliente y verifica que no tiene IP (`ip addr`).
2. Revisa la configuracion de r2: `/ip dhcp-server print`, `/ip pool print`, `/ip dhcp-server network print`, `/ip address print`.
3. Identifica la discrepancia entre la red DHCP y la IP asignada a `ether3`.
4. Corrige la red DHCP para que coincida con `10.24.10.0/24` y gateway `10.24.10.1`.
5. Reinicia el servidor DHCP o la interfaz del cliente para que solicite IP de nuevo.
6. Verifica que el cliente ahora obtiene IP dentro del pool `10.24.10.10-10.24.10.100`.
7. Revisa `/ip firewall nat print` en r2. Identifica que la regla masquerade usa `out-interface=ether2` pero deberia usar `ether3` o la interfaz de salida correcta (en este caso, `ether2` es correcta para salida WAN, pero el cliente no llega al NAT porque el firewall filtra ICMP).
8. Revisa `/ip firewall filter print` y elimina o deshabilita las reglas que bloquean ICMP hacia adelante.
9. Desde el cliente, haz ping a `10.24.10.1` (r2) y a `10.24.0.1` (r1).
10. Documenta cada error encontrado y la correccion.

# Verificacion esperada

- El cliente Linux tiene una IP dentro de `10.24.10.10-10.24.10.100`.
- `/ip dhcp-server lease print` en r2 muestra un lease activo para el cliente.
- El ping desde el cliente a `10.24.10.1` responde correctamente.
- El ping desde el cliente a `10.24.0.1` (r1) responde correctamente.
- El firewall no bloquea ICMP de forma innecesaria.

# Entrega

- Lista de errores encontrados y su causa raiz.
- Salida de `/ip dhcp-server lease print` despues de la correccion.
- Salida de `/ip firewall nat print` y `/ip firewall filter print` final.
- Resultado de ping desde el cliente a `10.24.10.1` y `10.24.0.1`.
