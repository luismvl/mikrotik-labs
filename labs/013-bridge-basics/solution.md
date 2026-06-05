# Solucion

Crear un bridge, agregar puertos y asignar una IP al bridge.

Comandos representativos:
```
/interface bridge add name=bridge1

/interface bridge port add bridge=bridge1 interface=ether2
/interface bridge port add bridge=bridge1 interface=ether3

/ip address add address=192.168.13.1/24 interface=bridge1 network=192.168.13.0
```

Verificacion:
```
/interface bridge print
/interface bridge port print
/interface bridge host print
```

Explicacion:
- El bridge une ether2 y ether3 en un solo dominio de capa 2.
- La IP del bridge actua como la puerta de enlace para los dispositivos conectados.
- La tabla de hosts muestra las direcciones MAC aprendidas dinamicamente de cada puerto.
