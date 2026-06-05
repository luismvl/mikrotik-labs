# Solucion

Respuestas representativas al cuestionario:

1. Las bandas principales son 2.4 GHz (mayor alcance, mas interferencias) y 5 GHz (menor alcance, mas velocidad, menos congestion).
2. El modo `ap-bridge` es el estandar para un AP que da servicio a clientes. `station-bridge` (o `bridge`) permite funcionar como AP y conectarse a otro AP simultaneamente.
3. WPA2-Personal (PSK + AES-CCMP) es el minimo recomendado. WPA3 mejora la seguridad con SAE. WEP esta obsoleto y es facilmente vulnerable.
4. En 2.4 GHz se recomienda usar los canales 1, 6 u 11 para evitar solapamiento. Se puede usar `/interface wireless scan` para detectar interferencias.

Explicacion:
- `/interface wireless` agrupa las opciones de radio, frecuencia, potencia, modo y seguridad.
- Una configuracion basica segura incluye: SSID definido, banda 2.4 GHz o 5 GHz, modo ap-bridge, seguridad WPA2, y un canal limpio.
- La potencia de transmision y la antena influyen directamente en el alcance y la calidad de la senal.
