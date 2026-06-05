# Pistas

1. Si el cliente no obtiene IP, revisa en este orden: interfaz con IP, pool, red DHCP (network), servidor DHCP habilitado.
2. La red DHCP (`/ip dhcp-server network`) debe coincidir con la red de la interfaz donde escucha el servidor.
3. Si el cliente tiene IP pero no navega, revisa NAT (`/ip firewall nat print`), rutas (`/ip route print`) y filtros (`/ip firewall filter print`).
4. Un masquerade en srcnat requiere `out-interface` correcta o `src-address` adecuado.
5. Las reglas de firewall se procesan en orden; un `drop` temprano puede bloquear trafico legitimo.
6. Usa `/ip dhcp-server lease print` para confirmar que el servidor entrego una IP.
7. Usa `/ping` desde el cliente y desde el router para aislar donde se rompe la conectividad.
