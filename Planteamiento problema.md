# Forma de resolver el problema

Se comienza por ordenar los postulantes con sus respectivas ponderaciones para cada carrera, esto con el fin de al momento de extraer un postulante este es el mejor de los restantes dentro de una carrera.

Se selecciona todos los primeros puntajes restantes de las carreras que tienen vacantes disponibles con la condición de que el rut del postulante no se haya seleccionado previamente, así para todas  las carreras se tendrá el siguiente puntaje más alto (y por ende mejor posición).

Este set de puntajes debe ser analizado en busca de rut repetidos, puesto que de existir una colisión se debe elegir la carrera donde su posición sea mejor, en el caso de tener la misma posición, se elige la que tenga el puntaje de corte más alto.

Una vez terminado este paso se ingresan estos puntajes a las selecciones de las carreras correspondientes.

Gracias a que previamente se han ordenado los postulantes según su puntaje de ponderación, no existe la posibilidad de que un rut y puntaje proveniente de los postulantes de una carrera en particular obtenga mejor posición que los previamente seleccionados para esa carrera.

Este algoritmo se repite hasta que ya no se puedan ingresar más postulantes a las carreras, esto tanto por que no quedan vacantes restantes o porque no quedan más postulantes.

1.  Generar lista de seleccionados por carrera (inicialmente vacía).
2. Ordenar tuplas  (rut, ponderación) de postulantes por carrera de menor a mayor ponderación.
3. Extraer mejor tupla ponderación actual de cada carrera (final lista postulantes), si el rut está marcado ir al siguiente rut.
4. Crear un set con lost ruts extraídos donde la colisión se resuelve mediante elegir la mejor posición basado en la cantidad de seleccionados actuales para ambas carreras, en caso de tener la misma posición se elige la que tenga puntaje de corte más alto, en el caso de ser el mismo se elige por menor cantidad de cupos, si estos datos son iguales se elige donde pondere con mejor puntaje.
5. Los ruts del set de datos se ingresan a la carrera asociada.
6. Los ruts ingresados se marcan para no volver a poder ser extraídos de la lista de postulantes.
7. Una vez no quedan más postulantes para extraer o se han llenado todas las vacantes el algoritmo termina, en caso contrario volver al paso 3.


