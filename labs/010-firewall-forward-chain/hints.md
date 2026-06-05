# Pistas

1. El orden en la cadena `forward` es critico: las primeras reglas que coinciden se aplican.
2. `connection-state=established,related` debe ir al principio para no bloquear respuestas legitimas.
3. La regla de descarte debe ir despues de las reglas de permiso.
4. Usa `src-address` para identificar la LAN y `in-interface` para identificar la WAN.
5. Si filtras ICMP, asegurate de no afectar el diagnostico basico que necesites.
