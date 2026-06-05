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
/ip address add address=10.101.12.2/30 interface=ether2 comment=base-r1-r2
/ip address add address=10.101.23.1/30 interface=ether3 comment=base-r2-r3
