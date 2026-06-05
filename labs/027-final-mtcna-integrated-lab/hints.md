# Pistas

1. Revisa siempre en este orden: IP, rutas, DHCP, NAT, firewall, queues.
2. Si el cliente no obtiene IP, verifica que `ether3` en r2 tenga una IP en la misma red que el pool.
3. El NAT masquerade debe usar `out-interface` correcto. Si el cliente quiere llegar a r1, la salida es `ether2` en r2.
4. En el firewall, las reglas `accept` deben ir antes de `drop` en cada chain.
5. Las simple queues se activan cuando hay trafico. Genera ping con `size=1400` o usa `/tool bandwidth-test`.
6. Usa `/ip route print` para confirmar que r1 sabe como llegar a `10.27.10.0/24`.
7. `/tool traceroute` requiere que exista una ruta de retorno; si el firewall bloquea ICMP, traceroute falla.
