# Solucion

Configurar un servidor PPPoE en r1 y un cliente PPPoE en r2.

Comandos representativos:

En r1:
```
/ppp profile add name=pppoe-profile local-address=10.17.1.1 remote-address=10.17.1.2

/ppp secret add name=labuser password=labpass profile=pppoe-profile service=pppoe

/interface pppoe-server server add interface=ether2 service-name=lab-pppoe profile=pppoe-profile
```

En r2:
```
/interface pppoe-client add name=pppoe-out1 interface=ether2 user=labuser password=labpass
```

Verificacion:
```
/interface pppoe-client print
/ppp active print
/ip address print
```

Explicacion:
- El perfil define los parametros de la conexion, incluyendo las direcciones IP.
- El secreto valida las credenciales del cliente.
- El cliente PPPoE se autentica y recibe una direccion IP del servidor.
