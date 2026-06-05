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

/ip address add address=192.168.100.1/24 interface=ether2 network=192.168.100.0

/tool netwatch remove [find]
