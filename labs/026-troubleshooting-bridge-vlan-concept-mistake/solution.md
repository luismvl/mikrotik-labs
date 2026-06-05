# Solucion

Respuestas representativas al cuestionario:

1. **Errores en el escenario**:
   - Falta `vlan-filtering=yes` en el bridge. Sin esto, las reglas de `/interface bridge vlan` no se aplican.
   - Los puertos `ether2` y `ether3` estan marcados como `tagged` en VLAN 10, pero si los hosts conectados envian tramas untagged, el bridge no las asigna a VLAN 10 automaticamente (a menos que `pvid=10` este configurado en los ports).
   - Los hosts no reciben tramas untagged porque el puerto espera tagged. Los hosts necesitarian interfaces VLAN o el puerto deberia ser untagged.

2. **Diferencia entre `/interface vlan` y `/interface bridge vlan`**:
   - `/interface vlan add name=vlan10 interface=ether2 vlan-id=10`: crea una interfaz logica VLAN sobre una interfaz fisica. Funciona independientemente del bridge. El router procesa el tag.
   - `/interface bridge vlan add bridge=br1 vlan-ids=10 tagged=ether2`: configura el bridge para manejar tramas con VLAN tag 10 en el puerto `ether2`. Requiere `vlan-filtering=yes`.

3. **Efecto de `vlan-filtering=no`**: el bridge no filtra ni gestiona VLANs. Las tramas con tag pasan transparentemente (como si fueran tramas normales) o se descartan dependiendo del comportamiento por defecto del bridge.

4. **Configuracion correcta**:
   ```
   /interface bridge add name=br1 vlan-filtering=yes
   /interface bridge port add bridge=br1 interface=ether2 pvid=10
   /interface bridge port add bridge=br1 interface=ether3 pvid=10
   /interface bridge port add bridge=br1 interface=ether4
   /interface bridge vlan add bridge=br1 vlan-ids=10 untagged=ether2,ether3 tagged=ether4
   /interface bridge vlan add bridge=br1 vlan-ids=20 tagged=ether4
   ```

Explicacion:
- `pvid=10` en los puertos acceso hace que las tramas untagged que entran se asignen a VLAN 10.
- `ether4` es un trunk: recibe/envia tramas tagged para VLAN 10 y 20.
- `vlan-filtering=yes` es el interruptor maestro que habilita todo el control de VLAN en el bridge.
