/* ============================================================
   FOTOS PROPIAS  (aquí cambias las imágenes de tus misiones)

   1) Guarda tu foto en la carpeta  img/   (junto a index.html)
   2) Escribe una línea así dentro de FOTOS, con el nombre EXACTO
      de la misión y la ruta de tu foto:

        "Mi país: Panamá": "img/bandera.jpg",

   - Si dos grados tienen una misión con el mismo nombre y quieres
     fotos distintas, pon el grado delante:  "4|La construcción del Canal": "img/canal4.jpg",
   - Si no pones foto, la página busca una sola (y si no carga, muestra un emoji).
   - Cada línea termina con coma.

   NOMBRES DE LAS MISIONES (copia el que necesites):

   1.º grado - Geografía
     Conozco Panamá
     El mapa y los puntos cardinales
     Paisajes de Panamá
     Mi comunidad y sus lugares
     El agua en Panamá
     Cuidamos la naturaleza

   1.º grado - Historia
     Mi familia y mi historia
     Mi país: Panamá
     Fechas importantes de Panamá
     Mi escuela ayer y hoy
     Tradiciones de mi comunidad
     La bandera de Panamá

   2.º grado - Geografía
     Provincias y distritos
     Orientación y mapas
     Elementos naturales y construidos

   2.º grado - Historia
     Mi comunidad ayer y hoy
     Símbolos patrios y fechas nacionales
     Personajes y lugares históricos

   2.º grado - Geografía
     ¿A qué se dedica cada persona?
     ¿De dónde vienen los productos?
     Detectives de los recursos naturales
     ¿Cómo cuidamos nuestros bosques?
     Clasifica los medios de transporte
     Encuentra las vías de comunicación
     ¿Qué servicio necesita la comunidad?
     Conocemos nuestra diversidad cultural
     ¿Cómo se relacionan las comunidades?
     Protejamos al águila harpía
     El planeta necesita nuestra ayuda
     Aventura por el mapa de Panamá

   2.º grado - Historia
     ¿Cómo era nuestra comunidad antes?
     Descubrimos a los primeros pobladores
     Los cambios de nuestra comunidad
     ¿Qué pasó primero?
     Conocemos las fechas patrias
     El Canal de Panamá: un acontecimiento histórico
     Descubrimos nuestra vestimenta típica
     Los bailes y tradiciones de Panamá
     Sabores de nuestra tierra
     Conocemos las artesanías panameñas
     Los símbolos de nuestra nación
     La gran aventura de la historia panameña

   3.º grado - Geografía
     Posición geográfica de Panamá
     El Canal de Panamá
     Relieve, ríos e islas
     Provincias de Panamá
     El clima de Panamá
     Cuidado del ambiente

   3.º grado - Historia
     Los primeros habitantes de Panamá
     Independencia de España
     Separación de Colombia y fechas históricas
     Panamá Viejo y la época colonial
     Símbolos patrios
     Los Tratados Torrijos-Carter

   4.º grado - Geografía
     Relieve y clima de Panamá
     Ríos, costas y recursos naturales
     Provincias, actividades y regiones
     Cordilleras y volcanes
     Islas y costas
     Áreas protegidas y biodiversidad

   4.º grado - Historia
     Pueblos originarios y diversidad cultural
     Independencia y separación
     Hechos importantes del siglo XX
     La época colonial
     La construcción del Canal
     Las fiestas patrias de noviembre

   5.º grado - Geografía
     División política y territorial de Panamá
     Relieve, ríos y clima de Panamá
     Recursos naturales y medio ambiente
     Las vertientes de Panamá
     Actividades económicas de Panamá
     La población panameña

   5.º grado - Historia
     Los primeros habitantes de Panamá
     Panamá durante la época colonial
     Independencia y unión a Colombia
     La separación de Colombia en 1903
     La construcción del Canal
     Soberanía en el siglo XX

   6.º grado - Geografía
     El continente americano y su ubicación geográfica
     Características físicas y naturales de América
     Población, economía y comunicación de América
     Países de Centroamérica
     Ríos y lagos de América
     Climas de América

   6.º grado - Historia
     Las civilizaciones antiguas de América
     Descubrimiento, conquista y colonización de América
     Panamá: historia, soberanía y acontecimientos nacionales
     La independencia de América
     El Congreso Anfictiónico de Panamá
     Panamá y el comercio mundial
============================================================ */
const FOTOS = {
   "Mi país: Panamá": "https://tse2.mm.bing.net/th/id/OIP.zuY77Rb3iYgit30C1eUmKgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
     "Mi familia y mi historia": "https://th.bing.com/th/id/R.44d8a7def1957237b1718ba2d7afa863?rik=sq5cc7JoGERmPA&pid=ImgRaw&r=0",
       "Tradiciones de mi comunidad": "https://tse2.mm.bing.net/th/id/OIP.4VUBGEGxlfVRjJleY3kuDwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
       "El mapa y los puntos cardinales": "https://tse3.mm.bing.net/th/id/OIP.EhGFMUkyWwTH7uGx0DYNhgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
       "Conozco Panamá": "https://img.freepik.com/vector-gratis/fondo-plano-dia-independencia-panama_23-2149720513.jpg",
       "Mi comunidad y sus lugares": "https://tse3.mm.bing.net/th/id/OIP.ocKChQtSsnXuQjHRW8X06wHaEw?r=0&w=1024&h=658&rs=1&pid=ImgDetMain&o=7&rm=3",
       "El agua en Panamá": "https://s3.amazonaws.com/prod-wp-tunota/wp-content/uploads/2023/03/principal_carteles-del-cuidado-del-agua-para-ninos-imagenes-y-dibujos-que-puedes-hacer.png",
      "El clima de Panamá": "https://img.freepik.com/fotos-premium/bosque-selva-tropical-lago-noche-clima-lluvioso-rios-caminos-plantas-arboles-lianas-ilustracion-dibujos-animados-modernos_76964-159759.jpg?w=1380",
      "Cuidado del ambiente": "https://tse4.mm.bing.net/th/id/OIP.-CQPOw_Tq2A12HRHyf0u_AHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
       "Relieve y clima de Panamá": "https://1.bp.blogspot.com/-9QZQs6Gs9MQ/XbppLSoVDlI/AAAAAAAAKJU/V-BamgDQE8048i8LFk5T3Rh5xHG8K3t7wCKgBGAsYHg/s640/15724976488056409921218319955017.jpg",
       "La población panameña": "https://panamanicole.weebly.com/uploads/1/0/4/1/104172296/panamenos23_orig.jpg",
        "Recursos naturales y medio ambiente": "https://th.bing.com/th/id/OIP.m-R8frWQuJR6kXUGBPP_MwHaEj?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
         "Relieve, ríos y clima de Panamá": "https://escuelademapas.com/wp-content/uploads/2024/01/Mapa-hidrografico-de-panama.png",
         
        

      
};
