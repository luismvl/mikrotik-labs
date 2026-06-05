# Pistas

1. En RouterOS, las reglas de firewall se procesan de arriba hacia abajo. La primera coincidencia determina la accion.
2. Un `drop all else` al principio de una chain bloquea todo el trafico, incluso el legitimo.
3. La regla `accept connection-state=established,related` suele ir primero para permitir trafico de retorno.
4. Coloca las reglas `accept` especificas antes de las reglas `drop` generales.
5. Usa `/ip firewall filter print` para ver el orden. Puedes mover reglas con `move`.
6. Para mover una regla: `/ip firewall filter move NUMERO_DESTINO NUMERO_ORIGEN`.
7. Si no recuerdas los numeros, usa `print` para ver el indice de cada regla.
