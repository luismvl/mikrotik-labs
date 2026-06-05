# Pistas

1. El orden de las reglas en el firewall es critico: las primeras que coinciden ganan.
2. `connection-state=established,related` debe ir al principio para no bloquear respuestas legitimas.
3. Usa `in-interface` o `src-address` para limitar el origen.
4. La regla `drop` al final debe estar despues de las reglas de permiso.
5. Si te quedas fuera, reinicia el contenedor o usa una sesion alternativa; por eso prueba primero desde LAN.
