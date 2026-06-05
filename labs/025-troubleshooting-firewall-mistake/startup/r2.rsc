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

/ip address add address=10.25.0.2/30 interface=ether2 network=10.25.0.0
/ip address add address=10.25.2.1/30 interface=ether3 network=10.25.2.0

/ip route add dst-address=10.25.1.0/30 gateway=10.25.0.1

# Firewall con errores intencionales en r2
# Error 1: drop all else esta antes de allow icmp
/ip firewall filter add chain=input action=drop comment="drop all else"
/ip firewall filter add chain=input action=accept connection-state=established,related comment="allow established"
/ip firewall filter add chain=input action=accept protocol=icmp comment="allow icmp"

# Error 2: forward bloquea todo antes de permitir trafico entre redes
/ip firewall filter add chain=forward action=drop comment="drop all else"
/ip firewall filter add chain=forward action=accept connection-state=established,related comment="allow established"
/ip firewall filter add chain=forward action=accept src-address=10.25.0.0/30 dst-address=10.25.1.0/30 comment="allow lan to lan"

/tool netwatch remove [find]
