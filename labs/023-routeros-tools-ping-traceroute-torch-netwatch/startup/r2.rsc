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

/ip address add address=10.23.0.2/30 interface=ether2 network=10.23.0.0
/ip address add address=10.23.2.1/30 interface=ether3 network=10.23.2.0

/ip route add dst-address=10.23.1.0/30 gateway=10.23.0.1

/tool netwatch remove [find]
