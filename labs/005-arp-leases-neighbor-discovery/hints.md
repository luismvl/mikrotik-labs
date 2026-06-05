# Pistas

1. Un lease estatico garantiza que el cliente siempre reciba la misma IP.
2. Puedes convertir un lease dinamico a estatico desde WinBox o con el comando `make-static`.
3. ARP estatico vincula una IP con una MAC de forma fija.
4. El neighbor discovery usa MNDP por defecto en MikroTik; CDP y LLDP son opcionales.
5. Si no ves vecinos, verifica que el descubrimiento este habilitado en la interfaz.
