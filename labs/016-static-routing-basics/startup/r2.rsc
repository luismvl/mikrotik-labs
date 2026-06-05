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

/ip address add address=10.16.0.2/30 interface=ether2 network=10.16.0.0
/ip address add address=172.16.0.1/24 interface=ether3 network=172.16.0.0

/tool netwatch remove [find]
