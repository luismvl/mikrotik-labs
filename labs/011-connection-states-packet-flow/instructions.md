# Contexto

RouterOS gestiona el trafico mediante un flujo de paquetes definido y un sistema de seguimiento de conexiones. Comprender los estados de conexion (`new`, `established`, `related`, `invalid`) y el diagrama de flujo de paquetes es esencial para escribir reglas de firewall eficientes.

# Objetivos

1. Diferenciar los estados de conexion: `new`, `established`, `related`, `invalid`.
2. Identificar el orden de procesamiento en el flujo de paquetes de RouterOS.
3. Comprender el impacto de `fasttrack` en el flujo.
4. Relacionar cada cadena de firewall (`prerouting`, `forward`, `postrouting`, `input`, `output`) con su punto de evaluacion.

# Tareas

1. Responde las preguntas de autoevaluacion sobre estados de conexion.
2. Asocia cada cadena de firewall con el punto correcto del flujo de paquetes.
3. Identifica en que momento del flujo se puede activar `fasttrack`.
4. Explica que ocurre con un paquete que coincide con `fasttrack`.

# Verificacion esperada

- Respuestas correctas a las preguntas del cuestionario.
- Explicacion clara del recorrido de un paquete desde la interfaz de entrada hasta la de salida.

# Entrega

- Respuestas del cuestionario.
- Breve descripcion del flujo de paquetes en tus propias palabras.
