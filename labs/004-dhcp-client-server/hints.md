# Pistas

1. El cliente DHCP se configura con `/ip dhcp-client add interface=ether1 disabled=no`.
2. El servidor DHCP requiere tres pasos: pool, red (network) y servidor.
3. La red DHCP (network) define gateway, DNS y dominio.
4. Si el cliente no obtiene IP, verifica que la interfaz `ether2` tenga una IP en la misma red.
5. Puedes forzar una solicitud DHCP en Alpine con `udhcpc -i eth1`.
