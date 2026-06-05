# Pistas

1. El backup binario se crea con `/system backup save name=NOMBRE` y se restaura con `/system backup load name=NOMBRE`.
2. El export de texto se genera con `/export file=NOMBRE` o `/export verbose file=NOMBRE` para incluir mas detalles.
3. El backup binario es especifico del hardware (RouterBOARD, licencia) y no se puede cargar en otro modelo diferente.
4. El export de texto puede editarse y reimportarse con `/import file=NOMBRE`.
5. `/system reset-configuration` reinicia el router a fabrica; usar con precaucion.
