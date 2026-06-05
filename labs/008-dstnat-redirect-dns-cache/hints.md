# Pistas

1. Para redirigir DNS, usa `chain=dstnat protocol=udp dst-port=53 action=redirect to-ports=53`.
2. No olvides agregar la misma regla para TCP si deseas cubrir todas las consultas.
3. `action=redirect` envia el trafico al propio router; es util para forzar el uso del cache DNS.
4. El cache DNS se llena automaticamente al resolver nombres; verificalo con `/ip dns cache print`.
5. Si usas dstNAT para publicar un servicio interno, especifica `to-addresses` y `to-ports`.
