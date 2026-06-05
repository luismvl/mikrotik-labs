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

/ip address add address=10.27.0.2/30 interface=ether2 network=10.27.0.0

# r2 parte con una configuracion incompleta
# No hay servidor DHCP, no hay NAT, no hay firewall, no hay rutas

/ip firewall nat remove [find]
/ip firewall filter remove [find]

/tool netwatch remove [find]
