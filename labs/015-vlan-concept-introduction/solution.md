# Solucion

Respuestas representativas al cuestionario:

1. Un puerto trunk transporta multiples VLANs usando etiquetas 802.1Q; un puerto access solo una VLAN sin etiquetas.
2. El VID identifica a que VLAN pertenece una trama dentro de un enlace trunk.
3. Se crea una interfaz VLAN en RouterOS cuando se necesita una interfaz logica para una VLAN especifica sobre un bridge o puerto fisico.
4. Un bridge puede actuar como switch gestionando VLANs si se configuran los puertos con VLANs y se usan filtros de VLAN adecuados.

Explicacion:
- El etiquetado 802.1Q inserta 4 bytes en la trama Ethernet con el VID.
- Los dispositivos finales (access) no necesitan saber nada sobre VLANs; solo el switch.
- Los routers o switches conectados por trunks deben interpretar las etiquetas para encaminar el trafico correctamente.
