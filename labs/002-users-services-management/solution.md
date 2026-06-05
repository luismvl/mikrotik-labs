# Solucion

El objetivo es reducir la superficie de ataque y mantener la gestion operativa.

Comandos representativos:
```
/system identity set name=MTCNA-LAB-002

/user add name=alumno group=full password=AlumnoSeguro123!

/ip service set telnet disabled=yes
/ip service set ftp disabled=yes
/ip service set api disabled=yes
/ip service set api-ssl disabled=yes
```

Verificacion:
```
/user print
/ip service print
/system identity print
```

Resultado esperado:
- Identidad cambiada.
- Usuario `alumno` presente.
- Solo ssh, www y winbox estan habilitados (u otros que decidas mantener).
