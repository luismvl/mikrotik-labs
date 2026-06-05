# Solucion

La solucion se basa en habilitar los servicios de acceso y verificar conectividad.

1. Conecta por WinBox usando la IP o el puerto local mapeado `18001`.
2. Conecta por SSH:
```
ssh -p 12001 admin@localhost
```
3. Cambia la contrasena dentro del router:
```
/user set admin password=TuNuevaPass
```
4. Accede a WebFig en `http://localhost:8081`.
5. Verifica servicios:
```
/ip service print
```
Esperado: ssh, telnet, ftp, www, ssl, www-ssl, api, api-ssl, winbox; al menos ssh, www y winbox deben estar habilitados.

Comandos representativos:
```
/system identity print
/user print
/ip service set ssh disabled=no
/ip service set www disabled=no
/ip service set winbox disabled=no
```
