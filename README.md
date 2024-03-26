SisManCT es un sistema desarrollado en React y ExpressJS, integrando una base de datos en MongoDB. 
La finalidad de este sistema es satisfacer las necesidades del departamento de Mantenimiento de una empresa industrial cuya actividad es el tratamiento térmico de acero a terceros.
Este sistema está integramente desarrollado por mi, desde el estudio de las necesidades del sector, UI/UX, usabilidad pensada para el nivel de usuarios que van a interactuar con el sistema
(personas mayores o que no están muy familiarizados con el uso de sistemas informáticos), por eso algunas interacciones son con mensajes simples y directos, como así también el uso de 
formularios con campos grandes y facilmente identificados. También desarrolle el BackEnd completo, utilizando mongoose como midleware entre Express y MongoDB.

Cabe destacar que la empresa habia contratado el desarrollo de un sistema anterior, el cual no llego a implementarse por representar una gran dificultad en su uso y entendimiento por parte 
del personal interviniente, además de presentar errores que no fueron solucionados en tiempo y forma por el desarrollador, dejandose de lado y continuando con el sistema de planillas en papel.

Entre sus principales características, este sistema permite:
- Regstrar usuarios, otorgando permisos en base a su clasificación: Administrador o Empleado.
- El ingreso se lleva a cabo con el nombre y el DNI de cada usuario, este último a modo de contraseña, se utiliza Bcript para su encriptación, evitando de esta forma que los usuarios olviden la contraseña e ingresen rapidamente.
- Generar pedidos de mantenimiento sin necesidad de registrarse, es decir, todo el personal de la empresa puede generar desde la pantalla principal un pedido de mantenimiento el cual será gestionado luego por el departamento de Mnto.
- Gestionar repuestos críticos, el responsable de mantenimiento recibirá alertas cuando la cantidad de repuestos críticos esté en su mínimo.
- Registrar y gestionar equipos productivos
- Registrar y gestionar infraestructura
- Registrar y gestionar tareas de mantenimiento
- Registrar y gestionar mantenimiento preventivo, para esto, el propio sistema se encarga de mostrar las tareas según su frecuencia (diaria, semanal, quincenal, mensual) previamente definidas por el administrador, a los empleados para su ejecución
- Registrar y gestionar mantenimiento correctivo, a partir de pedidos de mantenimiento o el registro de los mismos por parte del administrador.
- Calcular el costo del mantenimiento correctivo, con posibilidad de exportar registros a excel.
- Registrar y gestionar controles de pirometría (control de temperatura a hornos industriales) permitiendo la exportación de estos registros en formato PDF para ser compartido con las empresas que requieren estos controles
- Visualizar indicadores de cumplimiento de tareas por parte de los empleados y su tiempo de ejecución, lo cual permite tomar desiciones sobre cambio de roles o necesidad de capacitación a los empleados.
- Integrar con tableros de indicadores según norma ISO 9001, dada la facilidad para exportar tablas a excel.
- Administrar Bitacora de Mantenimiento: sección donde el administrador mantiene día a día las tareas realizadas por el y su equipo en la empresa.

Este sistema se encuentra implementado y corriendo localmente en la red de la empresa, para lo cual, también tuve que configurar un servidor apache, utilizando XAMPP.

Agradecimiento a todos aquellos que me apoyaron y aconsejaron en este extenso proyecto, entre ellos: Gonzalo Leguizamón (desarrollador Sr) y Fernando Andreassi (mi maestro Jeddy en todo esto).
y obviamente a Cementa Tem S.A. quienes confiaron en mi para el desarrollo de esta aplicación.

Seguramente hay muchas cosas por mejorar, dado que es mi primer desarrollo integramente hecho desde cero y sin un modelo de referencia.

Para contactos o sugerencias, pueden escribir a: gustavorip81@gmail.com

Saludos a toda la comunidad desarrolladora.
