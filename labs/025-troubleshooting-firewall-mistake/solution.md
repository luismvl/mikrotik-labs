# Solucion

Errores intencionales y correcciones:

1. **Orden incorrecto en chain input**: la regla `drop all else` estaba antes que `allow icmp` y `allow established`, bloqueando todo el trafico.
2. **Orden incorrecto en chain forward**: la regla `drop all else` estaba antes que `allow lan to lan`, bloqueando el trafico entre redes.

Correccion en r2:
```
# Reordenar input
/ip firewall filter move 1 0
# O eliminar y recrear en orden correcto
/ip firewall filter remove [find]

/ip firewall filter add chain=input action=accept connection-state=established,related comment="allow established"
/ip firewall filter add chain=input action=accept protocol=icmp comment="allow icmp"
/ip firewall filter add chain=input action=drop comment="drop all else"

/ip firewall filter add chain=forward action=accept connection-state=established,related comment="allow established"
/ip firewall filter add chain=forward action=accept src-address=10.25.0.0/30 dst-address=10.25.1.0/30 comment="allow lan to lan"
/ip firewall filter add chain=forward action=drop comment="drop all else"
```

Verificacion:
```
/ip firewall filter print

/ping 10.25.0.2 count=10
/ping 10.25.2.1 count=10

# Desde r2
/ping 10.25.1.1 count=10
```

Explicacion:
- El firewall de RouterOS evalua reglas secuencialmente. La primera coincidencia gana.
- Si un `drop` generico precede a un `accept` especifico, el trafico nunca llega a la regla de aceptacion.
- La practica recomendada es: permitir trafico establecido/relacionado, permitir trafico especifico necesario, y finalmente descartar todo lo demas.
