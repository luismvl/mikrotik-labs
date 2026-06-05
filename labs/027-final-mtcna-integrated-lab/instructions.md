# Contexto

Este laboratorio integrado simula un escenario de examen MTCNA donde debes configurar desde cero (o completar) una red funcional con dos routers y un cliente Linux. Debes aplicar conocimientos de direccionamiento IP, DHCP, NAT, firewall, queues, rutas y herramientas de diagnostico para lograr conectividad completa y controlada.

# Objetivos

1. Configurar direccionamiento IP, rutas estaticas y DHCP entre dos routers.
2. Aplicar NAT masquerade para salida a Internet simulada.
3. Configurar firewall filter basico que permita trafico legitimo y bloquee lo demas.
4. Implementar simple queues para limitar ancho de banda entre redes.
5. Usar herramientas de diagnostico para verificar la configuracion final.

# Tareas

## Parte 1: Conectividad basica (r1 - r2)

1. Conectate a r1 y r2.
2. Verifica que r1 tiene `10.27.0.1/30` en `ether2`.
3. Verifica que r2 tiene `10.27.0.2/30` en `ether2`.
4. En r1, agrega una ruta estatica hacia `10.27.10.0/24` via `10.27.0.2` (red LAN del cliente).
5. Desde r1, haz ping a `10.27.0.2` y confirma conectividad.

## Parte 2: Red LAN del cliente (r2)

6. En r2, asigna `10.27.10.1/24` a `ether3`.
7. Crea un pool `client-pool` con rango `10.27.10.10-10.27.10.100`.
8. Configura un servidor DHCP en `ether3` con red `10.27.10.0/24`, gateway `10.27.10.1`, DNS `8.8.8.8`.
9. En el contenedor cliente, solicita IP por DHCP (`udhcpc -i eth1` o reinicia la interfaz).
10. Verifica que el cliente obtiene IP dentro del pool.
11. Desde el cliente, haz ping a `10.27.10.1` (r2).

## Parte 3: NAT masquerade (r2)

12. En r2, configura NAT masquerade en `chain=srcnat` con `out-interface=ether2` para que el cliente pueda alcanzar r1.
13. Desde el cliente, haz ping a `10.27.0.1` (r1).

## Parte 4: Firewall filter (r2)

14. En r2, agrega reglas de firewall en `input` y `forward`:
    - `input`: accept established,related; accept icmp; drop all else.
    - `forward`: accept established,related; accept desde `10.27.10.0/24` hacia `10.27.0.0/30`; drop all else.
15. Verifica que el cliente puede hacer ping a r1 y r2, pero no se puede acceder a puertos no autorizados.

## Parte 5: Queues (r2)

16. En r2, crea una simple queue `limit-client` con `target=10.27.10.0/24`, `max-limit=2M/4M`.
17. Genera trafico desde el cliente hacia r1 (ping grande o bandwidth-test) y verifica que la queue se activa.

## Parte 6: Diagnostico

18. En r2, usa `/tool torch ether3` mientras el cliente genera trafico.
19. En r2, configura `/tool netwatch` para monitorear `10.27.0.1`.
20. En r1, usa `/tool traceroute 10.27.10.10` (IP del cliente).

# Verificacion esperada

- El cliente Linux tiene IP dentro de `10.27.10.10-10.27.10.100`.
- `/ip dhcp-server lease print` en r2 muestra el lease del cliente.
- El cliente puede hacer ping a `10.27.10.1`, `10.27.0.2` y `10.27.0.1`.
- `/ip firewall filter print` en r2 muestra reglas ordenadas correctamente.
- `/queue simple print` en r2 muestra `limit-client` activa con rate > 0.
- `/tool netwatch print` en r2 muestra `10.27.0.1` como `up`.

# Entrega

- Salida de `/ip address print`, `/ip route print` en r1 y r2.
- Salida de `/ip dhcp-server lease print` en r2.
- Resultado de ping desde el cliente a `10.27.0.1`.
- Salida de `/ip firewall filter print` en r2.
- Salida de `/queue simple print` en r2.
- Salida de `/tool netwatch print` y `/tool torch` en r2.
