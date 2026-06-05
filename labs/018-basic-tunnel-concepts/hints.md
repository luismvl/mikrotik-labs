# Pistas

1. IPIP es el mas simple: encapsula paquetes IP dentro de IP sin estado adicional.
2. GRE encapsula diversos protocolos (no solo IP) y permite opciones adicionales.
3. EoIP encapsula tramas Ethernet completas, permitiendo transportar capa 2 sobre IP.
4. Todos los tuneles requieren una direccion IP local y una remota alcanzable.
5. Los tuneles pueden pasar por NAT, pero GRE requiere a veces ajustes adicionales.
