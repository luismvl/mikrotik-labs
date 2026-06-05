# Contexto

Los problemas de bridge suelen deberse a puertos faltantes, bridges deshabilitados o configuraciones de IP incorrectas. Este lab presenta un escenario con errores comunes que debes diagnosticar y corregir.

# Objetivos

1. Identificar puertos faltantes o mal configurados en un bridge.
2. Verificar la tabla de hosts y detectar ausencia de entradas.
3. Corregir configuraciones de bridge que impiden la comunicacion.
4. Validar conectividad despues de aplicar correcciones.

# Tareas

1. Conectate a r1 y r2.
2. Revisa el estado del bridge en ambos routers.
3. En r1, detecta que falta un puerto en `bridge1`.
4. Agrega el puerto faltante y verifica que el bridge este habilitado.
5. Verifica `/interface bridge host print` en r1 para confirmar que aprende la MAC de r2.
6. En r2, verifica que la direccion IP y la interfaz estan correctas.
7. Comprueba conectividad con ping entre r1 y r2.

# Verificacion esperada

- `/interface bridge port print` en r1 muestra todos los puertos necesarios.
- `/interface bridge host print` muestra la MAC de r2.
- `ping` entre r1 y r2 funciona correctamente.

# Entrega

- Salida de `/interface bridge port print` y `/interface bridge host print` despues de la correccion.
- Descripcion de los errores encontrados y como los corregiste.
