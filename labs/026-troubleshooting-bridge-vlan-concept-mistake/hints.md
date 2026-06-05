# Pistas

1. `vlan-filtering=yes` en el bridge es obligatorio para que `/interface bridge vlan` tenga efecto.
2. Un puerto acceso (untagged) no debe aparecer en `tagged` dentro de `/interface bridge vlan` para esa VLAN; debe aparecer en `untagged`.
3. `/interface vlan add` crea una interfaz logica VLAN sobre una interfaz fisica; no requiere bridge ni vlan-filtering.
4. `/interface bridge vlan add` configura el comportamiento de VLAN dentro de un bridge con vlan-filtering activado.
5. Si un puerto esta en `tagged` pero el host conectado envia tramas sin tag (untagged), el bridge descarta las tramas o las envia sin VLAN.
6. El `pvid` de un bridge port define la VLAN por defecto para tramas sin tag que entran por ese puerto.
