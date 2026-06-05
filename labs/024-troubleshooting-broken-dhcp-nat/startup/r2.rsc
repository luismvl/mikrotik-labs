/system identity set name=r2

/user set admin password=admin

/ip service set ssh disabled=no
/ip service set www disabled=no
/ip service set winbox disabled=no
/ip service set ftp disabled=yes
/ip service set telnet disabled=yes
/ip service set api disabled=yes
/ip service set api-ssl disabled=yes

/system clock set time-zone-name=UTC

/ip address add address=10.24.0.2/30 interface=ether2 network=10.24.0.0

# DHCP server con error intencional: red DHCP mal configurada
/ip pool add name=lan-pool ranges=10.24.10.10-10.24.10.100

/ip address add address=10.24.10.1/24 interface=ether3 network=10.24.10.0

# Error: la red DHCP no coincide con la interfaz
/ip dhcp-server network add address=10.24.20.0/24 gateway=10.24.20.1 dns-server=8.8.8.8

/ip dhcp-server add name=dhcp-lan interface=ether3 address-pool=lan-pool disabled=no

# Error: NAT masquerade apunta a interfaz equivocada
/ip firewall nat add chain=srcnat action=masquerade out-interface=ether2

# Bloqueo ICMP intencional para dificultar troubleshooting
/ip firewall filter add chain=forward protocol=icmp action=drop comment="block icmp"

/ip firewall filter add chain=input protocol=icmp action=drop comment="block icmp input"

/tool netwatch remove [find]
