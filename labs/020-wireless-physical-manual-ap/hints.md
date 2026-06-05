# Pistas

1. Si usas WinBox, puedes conectarte por MAC address sin necesidad de IP previa.
2. En `/interface wireless` asegurate de que `band` y `frequency` correspondan a la capacidad real del hardware.
3. El security profile se crea en `/interface wireless security-profiles` y se asigna a la interfaz con `security-profile=NOMBRE`.
4. Si la interfaz wireless no aparece en `/interface wireless print`, verifica que la tarjeta miniPCI-e o el chip integrado esten detectados en `/system routerboard`.
5. Para bridge simple: `/interface bridge add name=bridge1`, `/interface bridge port add bridge=bridge1 interface=wlan1`.
6. Si el cliente no obtiene IP, revisa que el servidor DHCP tenga la interfaz correcta y que la red (network) tenga gateway definido.
