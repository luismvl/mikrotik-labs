# Pistas

1. Masquerade oculta las IPs privadas detras de la IP de la interfaz WAN.
2. La regla NAT masquerade requiere al menos: `chain=srcnat action=masquerade out-interface=ether1`.
3. Sin una ruta por defecto valida, los paquetes no saldran hacia r2.
4. Si usas cliente DHCP en WAN, la ruta por defecto se agrega automaticamente.
5. El firewall no bloquea por defecto en una instalacion limpia, pero si agregaste reglas input, verifica que no afecten el forward.
