# Contexto

En este escenario de troubleshooting, el trafico entre r1 y r2 funciona parcialmente, pero ciertos protocolos (como ICMP) y el trafico de forward entre redes LAN estan bloqueados. El problema esta en el orden de las reglas del firewall en r2, donde reglas `drop` se colocaron antes de reglas `accept` necesarias. Debes identificar el error, corregir el orden y verificar que todo el trafico legitimo fluya.

# Objetivos

1. Identificar reglas de firewall que bloquean trafico legitimo por error.
2. Corregir el orden de las reglas de filter sin comprometer la seguridad.
3. Verificar conectividad TCP, UDP e ICMP tras la correccion.
4. Explicar el impacto del orden de las reglas en el firewall de RouterOS.

# Tareas

1. Conectate a r1 y r2.
2. En r1, ejecuta `/ping 10.25.0.2 count=10` y `/ping 10.25.2.1 count=10`. Verifica que fallan.
3. En r2, revisa `/ip firewall filter print` y observa el orden de las reglas.
4. Identifica que en r2 la regla `drop all else` en `input` esta antes de `allow icmp`.
5. Identifica que en r2 la regla `drop all else` en `forward` esta antes de `allow lan to lan`.
6. Reordena las reglas en r2 para que `accept` preceda a `drop` dentro de cada chain:
   - `input`: 1) established,related 2) icmp 3) drop all else.
   - `forward`: 1) established,related 2) lan to lan 3) drop all else.
7. Desde r1, verifica que el ping a `10.25.0.2` y `10.25.2.1` funciona.
8. Desde r2, verifica que el ping a `10.25.1.1` funciona.
9. Verifica que SSH sigue funcionando entre r1 y r2 (capa TCP).
10. Documenta el orden original, el orden corregido y la razon.

# Verificacion esperada

- `/ping 10.25.0.2` desde r1 responde sin perdida.
- `/ping 10.25.2.1` desde r1 responde sin perdida.
- `/ping 10.25.1.1` desde r2 responde sin perdida.
- `/ip firewall filter print` en r2 muestra las reglas `accept` antes de `drop` en cada chain.
- SSH entre r1 y r2 funciona correctamente.

# Entrega

- Salida de `/ip firewall filter print` en r2 antes y despues de la correccion.
- Resultado de ping desde r1 a `10.25.0.2` y `10.25.2.1`.
- Resultado de ping desde r2 a `10.25.1.1`.
- Breve explicacion del impacto del orden de las reglas en `/ip firewall filter`.
