# Contexto

Los bridges y las VLANs en RouterOS son poderosos pero propensos a errores conceptuales. Configurar un puerto como tagged cuando deberia ser untagged, olvidar activar `vlan-filtering=yes`, o mezclar VLANs en interfaces independientes con VLANs en bridge son errores comunes. Este laboratorio es un cuestionario que evalua tu capacidad para detectar y corregir estos errores conceptuales.

# Objetivos

1. Identificar errores conceptuales en la configuracion de bridge ports.
2. Distinguir entre VLAN filtering en bridge y VLAN en interfaces independientes.
3. Reconocer cuando un puerto de bridge debe ser tagged o untagged.
4. Explicar la relacion entre `/interface bridge vlan` y `/interface bridge port`.

# Tareas

1. Responde las preguntas del cuestionario sobre bridge y VLAN en RouterOS.
2. Analiza el siguiente escenario: un administrador crea un bridge `br1`, agrega `ether2` y `ether3` como ports, y luego define `/interface bridge vlan add bridge=br1 tagged=ether2,ether3 vlan-ids=10`. Sin embargo, los hosts no se comunican entre `ether2` y `ether3` en la VLAN 10. Identifica al menos dos errores conceptuales.
3. Explica la diferencia entre `/interface vlan add name=vlan10 interface=ether2 vlan-id=10` y `/interface bridge vlan add bridge=br1 vlan-ids=10 tagged=ether2`.
4. Describe que ocurre si `vlan-filtering=yes` no esta activo en el bridge.
5. Propone una configuracion correcta para un bridge con dos puertos acceso (untagged VLAN 10) y un puerto trunk (tagged VLANs 10 y 20).

# Verificacion esperada

- Respuestas correctas al cuestionario.
- Identificacion clara de los errores conceptuales en el escenario propuesto.
- Explicacion correcta de la diferencia entre VLAN independiente y VLAN en bridge.

# Entrega

- Respuestas del cuestionario.
- Analisis del escenario con errores conceptuales y su solucion.
- Diagrama o descripcion de la configuracion correcta de bridge + VLAN.
