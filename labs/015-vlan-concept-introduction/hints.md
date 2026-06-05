# Pistas

1. Un puerto access pertenece a una sola VLAN y envia tramas sin etiqueta.
2. Un puerto trunk transporta multiples VLANs y envia tramas con etiqueta 802.1Q.
3. El VID es un numero de 12 bits (1-4094) que identifica la VLAN en la trama.
4. En RouterOS, se crea una interfaz VLAN (`/interface vlan`) asociada a un bridge o interfaz fisica.
5. El bridge puede actuar como un switch que gestiona VLANs si se configura adecuadamente.
