/system identity set name=r1

/user set admin password=admin

/ip service set ssh disabled=no
/ip service set www disabled=no
/ip service set winbox disabled=no
/ip service set ftp disabled=yes
/ip service set telnet disabled=yes
/ip service set api disabled=yes
/ip service set api-ssl disabled=yes

/system clock set time-zone-name=UTC

/ip address add address=10.25.0.1/30 interface=ether2 network=10.25.0.0
/ip address add address=10.25.1.1/30 interface=ether3 network=10.25.1.0

/ip route add dst-address=10.25.2.0/30 gateway=10.25.0.2

# Firewall con reglas correctas en r1
/ip firewall filter add chain=input action=accept connection-state=established,related comment="allow established"
/ip firewall filter add chain=input action=accept protocol=icmp comment="allow icmp"
/ip firewall filter add chain=input action=drop comment="drop all else"

/ip firewall filter add chain=forward action=accept connection-state=established,related comment="allow established"
/ip firewall filter add chain=forward action=accept src-address=10.25.0.0/30 dst-address=10.25.2.0/30 comment="allow lan to lan"
/ip firewall filter add chain=forward action=drop comment="drop all else"

/tool netwatch remove [find]
