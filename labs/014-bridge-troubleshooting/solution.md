# Solucion

Diagnosticar y corregir problemas de bridge.

Problemas comunes y comandos para corregirlos:
```
/interface bridge print
/interface bridge port print
```

Si falta un puerto:
```
/interface bridge port add bridge=bridge1 interface=ether3
```

Verificacion:
```
/interface bridge host print
/ping 192.168.14.2
```

Explicacion:
- Un bridge sin todos los puertos necesarios no conmuta trafico entre las interfaces faltantes.
- La tabla de hosts confirma que el bridge aprende direcciones MAC de los dispositivos conectados.
- Corregir los puertos y habilitar el bridge restaura la conectividad de capa 2.
