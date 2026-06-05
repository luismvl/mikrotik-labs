# Pistas

1. En RouterOS las interfaces Ethernet se llaman `ether1`, `ether2`, etc.
2. Usa `/ip address add address=... interface=...` para asignar una IP.
3. No olvides la mascara en notacion CIDR (ej. `/24`).
4. Si el ping falla, verifica que la interfaz este activa (`/interface print` columna R indica running).
5. Las rutas conectadas se crean automaticamente al asignar una IP a una interfaz.
