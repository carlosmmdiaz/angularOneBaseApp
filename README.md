# Angular Base App



## Getting Started

Para empezar simplemente tienes que clonar el repositorio y instalar las dependencias:

### Prerequisites

+ Utilizamos herramientas de node.js para inicializar. Debes tener instalado node.js y el package manager(npm). Puedes obtenerlo en [http://nodejs.org/].

+ Instalar ruby http://rubyonrails.org/download/ para poder generar SaSS

### Clone EXTGES_Front

Clonar el repositorio usando [git]:

```
git clone https://AXXXXX@aqdes-stash.cm.es/stash/scm/c6exextgs/extges_front.git
```

### Install Dependencies

Primero obtenemos la herramientas necesarias con:

```
npm install
```

ahora debemos crear un fichero _netrc con el siguiente contenido:

```
machine aqdes-stash.cm.es login AXXXXXX password ********
```

este fichero debe ir en Windows en la siguiente ruta:

	C:\Users\username

y despues instalamos todas nuestras librerias definidas en el bower.json de la app que es común.

```
bower install
```

## Gulp

Utilizamos gulp como automatizador de tareas. Las siguientes tareas son las más importante y se encuentran en la carpeta tasks:

* Build:
	Mediante esta tarea construimos la aplicación, tras haber pasado satisfactoriamente los tests disponibles. Al terminar nos genera una carpeta dist donde esta el proyecto para desplegar y un zip con el contenido de esa carpeta para que sea más liviano. Esta tarea llama a otras que copian los bower components, images, scripts y i18n a la carpeta dist que se crea en la construcción.
* Sass:
	Compila SaSS mediante Compass y copia el resultado a la carpeta styles.
* Zip:
	Crea un zip con toda la aplicación
* VPN-Angular:
	Modifica el core de angular para la compatibilidad con Juniper(VPN).

### Run the Application

Para ejecutar la aplicación simplemente:

```
gulp
```

**Nota 1**: La primera vez que se ejecute la aplicación deben compilarse los .jade de forma manual, para ello es necesario tener el servidor arrancado con gulp, y hacer una pequeña modificación en cualquier jade.

**Nota 2**: Para hacer el primer commit es necesario desactivar la verificación SSL en SourceTree o Git.

**Nota 3**: Por supuesto, debemos rellenar nuestra información de usuario en SourceTree o Git, con nuestro nombre o email:

```
git config --global user.name "Tu nombre"
git config --global user.email "TuEmail@example.com"
```

Abrir en el navegador `http://localhost:8080/`. Aunque se debería abrir solo de forma automatica si tenemos chrome instalado.

## Testing

Por el momento solo contamos con test unitarios.

### Running Unit Tests

La app viene pre-configurada con test unitarios. Estos están desarrollados en [Jasmine], los cuales se ejecutan con [Karma]. Ofrecemos un archivo de configuración para ejecutarlos.

* la configuración se encuentra en 'test/<app>/karma.conf.js'.
* los test unitarios se encuentran en 'test/<app>/tests/'. 

Para ejecutarlos simplemente encontrarse en la carpeta test/<app>:

````
karma start
````

En la construcción de la aplicación se ejecutan todos los test de los módulos y no se realiza una construción si los test unitarios fallan.

## Crear nuevo módulo

- Crear módulo ángular, controlador y router del módulo
- Añadir .jade con la carga de scripts (módulo, controlador y router) en app/jade/viewsScripts/views
- Añadir include del anterior fichero en app/jade/viewScripts/index[2].jade
- Registrar módulo ángular en app/scripts/[backoffice|extranet].js

## Updating Angular

La versión fijada es la 1.4.7 que ademas es modificada 'al vuelo' en la construcción para permitir la compatibilidad con la aplicación Juniper(VPN).

Se recomienda NO ACTUALIZAR la versión de angular. Ya que hay muchos componentes y dependencias que desconocemos como pueden llegar a comportarse en futuras versiones. Si se actualiza hay que comprobar que la función parseAppUrl() del core de angular se modifica añadiendo un if para compatibilizarlo con Juniper.

## Creación de un nuevo módulo en Tareas Expediente

A continuación se explica paso a paso como crear un nuevo módulo, para ello se va ha poner como ejemplo el módulo de gestión de provisión del vendedor dentro del bloque de post formalización.

### 1: Añadir los mocks.

Dentro del fichero:

````
/mocks/Neo/api/extranet/extranet/consultartareas/json/inicia.json
````

Debemos de añadir la nueva tarea y en caso de no existir, debemos de añadir también la fase. En nuestro caso, añadimos la nueva fase de POST FORMALIZACIÓN, y la tarea de Gestión de provisión del vendedor respetando la estructura del objeto con sus atributos, y el formato para los valores que se puedan tomar.

### 2: Añadir la nueva tarea en el fichero:

````
/app/scripts/directives/asideexpediente/scripts/tareas.values.js
````

Debemos de añadir el par codigoTarea/nombreDelEvento dentro de este fichero, estos valores deben de ser el código de la tarea que hemos declarado en el atributo codigoTarea del fichero inicia.json comentado en el primer paso, el sugundo atributo es el nombre del evento.

### 3: Crear las carpetas y los ficheros que componen el nuevo módulo.

Dentro de la carpeta /app/scripts/mods, debemos de crearnos una estructura de carpetas igual respetando el nombre de la fase y tarea, para nuestro caso, creamos las carprtas /postFormalizacion/gestionProvisionVendedor, el path completo quedaría de la siguiente forma:

````
/app/scripts/mods/postFormalizacion/gestionProvisionVendedor
````

dentro de la carpeta gestionProvisionVendedor creamos los siguientes ficheros:

````
backoffice.gestionProvisionVendedor.controller.js
backoffice.gestionProvisionVendedor.module.js
config.route.js
detalles.jade
gestionProvisionVendedor.jade
````

Ahora debemos de crear la misma estructura de carpetas en el directorio /app/jade/viewsScripts/views, en nuestro caso, el path completo sería:

````
/app/jade/viewsScripts/views/postFormalizacion
````

dentro de esta carpeta, debemos de crear el fichero:

````
gestionProvisionVendedor.jade
````

### 4: Declarar una nueva vista.

Debemos de declarar la nueva vista dentro del fichero:

````
/app/jade/viewsScripts/index.jade
````

para ello añadimos una nueva línea con el path del nuevo módulo.

### 5: Añadir una nueva dependencia para el nuevo módulo.

Debemos de añadir una nueva dependencia en el fichero:

````
/app/scripts/extranet.js
````

Debemos declarar el nombre de nuestro nuevo módulo.

### 6: Descripcion de ficheros:

A continuación, vamos a realizar una breve descripción de cada uno de estos ficheros:

#### backoffice.gestionProvisionVendedor.module.js

En este fichero es declaramos el nombre de nuestro módulo.

#### backoffice.gestionProvisionVendedor.controller.js

En este fichero es donde tenemos el controlador del módulo, debemos de cargar cierta información referente al expediente, la propuesta y el informe, además de definir las funciones obtenerDatosExpediente, loadInforme, setInforme, pieExtranetAceptar y pieExtranetAbandonar.

#### config.route.js

En este fichero es donde declaramos la URL, el template, el controlador e información de configuración.

#### /app/scripts/mods/postFormalizacion/gestionProvisionVendedor/gestionProvisionVendedor.jade y detalles.jade

En este fichero se declara la estructura HTML básica que debe de incluir cada tarea. En él, se añade el menú lateral y el pie, así como su funcionalidad, además incluye el template de detalle, que es donde se debe de especificar el template de la tarea.

#### /app/jade/viewsScripts/views/postFormalizacion/gestionProvisionVendedor.jade

Por último, en este fichero se debe de incluir todos los scripts que componen la tarea, es decir todos aquellos ficheros js que tenemos en el directorio:

````
/app/scripts/mods/postFormalizacion/gestionProvisionVendedor
````

## Authors

#### Original Author and Development Lead

- Ignacio Jiménez Cuenca (ignacio.jimenez@adesis.com)

#### Co-Authors

- Carlos Manuel Muñoz Díaz (csmu@gft.com)
- Victor Manuel Gutierrez Martin (victor.gutierrez@gft.com)

#### Contributors

- Victor Jose Portals Lorenzo (Victor-Jose.Portals@gft.com)
- Pablo Lázaro (pablo.lazaro@adesis.com)
- Miguel Alcaraz Jerónimo (miguel.alcaraz@gft.com)

#### Other Authors

- Israel Fuentes Gutiérrez (ifuentes@gfi.es)
- Ismael Rodriguez (irodriguez@gfi.es)