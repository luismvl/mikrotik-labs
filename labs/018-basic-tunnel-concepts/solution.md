# Solucion

Respuestas representativas al cuestionario:

1. El tunnel que encapsula tramas Ethernet completas es EoIP.
2. IPIP solo encapsula paquetes IP dentro de IP; GRE encapsula diversos protocolos y soporta opciones adicionales.
3. Un tunnel une dos oficinas remotas sobre Internet como si estuvieran en la misma red privada.
4. Requisitos basicos: direccion IP local, direccion IP remota, y a veces un ID de tunnel (EoIP).

Explicacion:
- IPIP es ligero y facil de configurar; util para rutas estaticas entre routers.
- GRE es mas flexible y permite multicast, util para protocolos de enrutamiento dinamico.
- EoIP es ideal cuando se necesita transportar capa 2 (por ejemplo, para VLANs o broadcast) entre sitios.
