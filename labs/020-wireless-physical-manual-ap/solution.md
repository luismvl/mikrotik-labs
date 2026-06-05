# Solucion

Puntos de verificacion manual:

1. SSID visible: desde el cliente (laptop o telefono) se detecta `MTCNA-Lab-020`.
2. Cliente conectado: la interfaz wireless del cliente muestra conectada.
3. DHCP lease: en el router, `/ip dhcp-server lease print` muestra una entrada dinamica con la MAC del cliente.
4. Gateway ping: desde el cliente, `ping 192.168.88.1` responde correctamente.
5. Registration table: `/interface wireless registration-table print` muestra el cliente conectado.

Comandos representativos en RouterOS:
```
/interface wireless security-profiles add name=wpa2-profile mode=dynamic-keys authentication-types=wpa2-psk wpa2-pre-shared-key=MikroTik2024

/interface wireless set [find name=wlan1] mode=ap-bridge ssid=MTCNA-Lab-020 band=2ghz-g/n security-profile=wpa2-profile frequency=2412 disabled=no

/interface bridge add name=bridge1
/interface bridge port add bridge=bridge1 interface=wlan1

/ip address add address=192.168.88.1/24 interface=bridge1

/ip pool add name=wifi-pool ranges=192.168.88.10-192.168.88.100

/ip dhcp-server network add address=192.168.88.0/24 gateway=192.168.88.1 dns-server=8.8.8.8

/ip dhcp-server add name=dhcp-wifi interface=bridge1 address-pool=wifi-pool disabled=no
```

Verificacion:
```
/interface wireless registration-table print
/ip dhcp-server lease print
```

En el cliente:
```
# Linux
ip addr show wlan0
ping 192.168.88.1

# Windows
ipconfig
ping 192.168.88.1
```
