# Pistas

1. El target de una simple queue puede ser una IP, una red, una interfaz o varios separados por comas.
2. `max-limit` usa el formato `subida/bajada`. Por ejemplo, `1M/2M`.
3. El parametro `dst` limita el trafico hacia el destino indicado, mientras que `target` define el origen o la entidad a la que se aplica la queue.
4. Si no hay trafico, la queue aparece como inactiva. Genera ping con payload grande o usa `/tool bandwidth-test` para activarla.
5. Usa `print stats` o `print detail` para ver los contadores de trafico en tiempo real.
