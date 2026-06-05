# Solucion

Crear y restaurar backups en RouterOS.

Comandos representativos:
```
/system backup save name=lab022-backup

/export file=lab022-export

/file print

/ip address remove [find interface=ether2]
/ip dhcp-server disable [find name=dhcp-lan]

/system backup load name=lab022-backup

/ip address print
/ip dhcp-server print
```

Diferencias clave:
- **Backup binario (.backup)**: restaura la configuracion completa, incluyendo usuarios, contrasenas, licencias y keys. Es especifico del hardware.
- **Export de texto (.rsc)**: genera un script de configuracion legible y editable. No incluye contrasenas por defecto (a menos que se use `show-sensitive`). Es portable entre dispositivos.
- **Import**: `/import file=NOMBRE` ejecuta el script de texto.
- **Reset**: `/system reset-configuration` borra todo y reinicia.

Verificacion:
```
/file print
/ip address print
/ip dhcp-server print
```
