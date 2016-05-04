/**
 * <h1>bankia-swl</h1>
 * <p>Módulo que proporciona servicios básicos del SWL (Servidor Web Local).
 * <ul>
 * <li><b>swl_proceso</b>. Permite abrir otros procesos del escritorio. Ver la clase Proceso para más 
 *     información sobre las funciones ofrecidas por este servicio.
 * <li><b>swl_msg</b>. Permite mostrar mensajes en el escritorio. Ver clase Mensaje.
 * </ul>
 * 
 */
(function() {
	var WS_STATE_IDLE       = 0;
	var WS_STATE_OPENING    = 1;
	var WS_STATE_WAITINGEVT = 2;
	var WS_STATE_CLOSED     = 3;

	var RESPONSE_ERR_INTERNO    = 203;
	var RESPONSE_OK	            = 0;
	var RESPONSE_OK_NOEVENT     = 10000;

	var EVT_INTERVAL = 2000;


	function getPOSTRequest(url,params) {
		return {
			"url" : url,
			"method":"POST",
			"data" : params,
			"headers":{"Content-Type" : "application/x-www-form-urlencoded"},
			"transformRequest": function(obj) {
		        var str = [];
		        for(var p in obj) {
		        	if(obj[p] !== null) {
		        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        	}
		        }
		        return str.join("&");
		    }
		};
	}

	function internalError(reason) {
		return {
			"result":RESPONSE_ERR_INTERNO,
			"message":"Error interno comunicando con el SWL",
			"detail":reason
		};
	}

	function getComURL($location) {
		return $location.protocol()==="https"?
			"https://localhost:40010/comunicacion":
			"http://localhost:40009/comunicacion";
	}

	function Task($http,$q,$location,taskID,onClose,subtask) {
		var thisObject = this;

		this.id = taskID;
		this.closeData = null;
		this.subtask = subtask;
		//Si está interesado por el cierre, creamos la promesa
		if(onClose) {
			this.closePromise = createClosePromise();
		}

		function errorCallBack(reason) {
			return $q.reject(internalError(reason));
		}

		this.activate = function() {
			var parametros = {
				"tipoOperacion" : "activate",
				"taskID" : thisObject.id,
				"version" : 2
			};
			$http(getPOSTRequest(getComURL($location),parametros))
				.then(function(res) {
						if(res.data.result===RESPONSE_OK) {
							return;
						}
						else {
							return $q.reject(res.data);
						}
				},errorCallBack);
		};

		function stopTimerClose() {
			clearInterval(closeTimer);
			closeTimer = null;
		}

		function createClosePromise() {
			return $q(function(resolve,reject) {
				checkCloseEvent(resolve,reject);
			});
		}

		function checkCloseEvent(resolve, reject) {
			var parametros = {
				"tipoOperacion" : subtask?"evCloseSub":"evClose",
				"taskID" : thisObject.id,
				"version" : 2
			};
			$http(getPOSTRequest(getComURL($location),parametros))
				.then(function(res) {
					if(res.data.result==RESPONSE_OK) {
						thisObject.closeData = res.data.datos;
						resolve(thisObject);
					}
					else if(res.data.result==RESPONSE_OK_NOEVENT) {
						checkCloseEvent(resolve, reject);
					}
					else {
						reject(res.data);
					}
				},
				function(reason) {
					reject(internalError(reason));
				});
		}
	}

	function WSTaskManager($http,$q,$location) {
		var currentClientTaskId = 0;
		var opened = false;
		var ws = new WebSocket(
			$location.protocol()==="https"?
				"wss://localhost:40010/comunicacionws":
				"ws://localhost:40009/comunicacionws");
		var tasks = new Map();
		var thisObj = this;

		function generateClientTaskId() {
			currentClientTaskId++;
			return currentClientTaskId;
		}

		function sendPending() {
			if(opened) {
				tasks.forEach(function (task) {
					task._openRequest();
				});
			}
		}

		ws.onopen = function() {
			opened = true;
			sendPending();
		};

		ws.onmessage = function(evt) {
			var msg = angular.fromJson(evt.data);
			if("result" in msg) {
				openMsg(msg);
			}
			else {
				closeEventMsg(msg);
			}
		};

		ws.onclose = function(evt) {
			tasks.clear();
		};

		function openMsg(msg) {
			task = tasks.get(msg.clientTaskId);
			if(task!==null) {
				task._openResponse(thisObj,msg);
			}
		}

		function closeEventMsg(msg) {
			task = tasks.get(msg.clientTaskId);
			if(task!==null) {
				task._closeEvent(thisObj,msg);
			}
		}

		this.registerTask = function(task) {
			tasks.set(task.clientTaskId,task);
			sendPending();
		};

		this.unregisterTask = function(clientTaskId) {
			tasks.delete(clientTaskId);
		};


		this.open = function(code, datos) {
			var task = new WSTask(
				$http,$q,$location,ws,
				generateClientTaskId(),
				code,datos,false);
			thisObj.registerTask(task);
			return task.openPromise;
		};

		this.openInTask = function(code, datos, taskID) {
			var task = new WSTask(
				$http,$q,$location,ws,
				generateClientTaskId(),
				code,datos,true,taskID);
			thisObj.registerTask(task);
			return task.openPromise;
		};
	}

	function WSTask($http,$q,$location,ws,
		cTaskId,
		code,params,subtask,parentTaskID) {

		var state = WS_STATE_IDLE;
		var openDefer = $q.defer();
		var closeDefer = $q.defer();
		var thisObj = this;

		this.clientTaskId = cTaskId;
		this.openPromise = openDefer.promise;
		this.closeData = null;
		this.subtask = subtask;
		this.closePromise = closeDefer.promise;
		this.id = -1;


		this._openRequest = function() {
			if(state===WS_STATE_IDLE) {
				var data;
				if(subtask) {
					data = {
						"tipoOperacion" : "opensub",
						"codigo" : code,
						"params" : angular.isDefined(params)?params:null,
						"idProceso" : angular.isDefined(parentTaskID)?parentTaskID:getIDProceso(),
						"clientTaskId" : cTaskId
					};
				}
				else {
					data = {
						"tipoOperacion" : "open",
						"codigo" : code,
						"params" : angular.isDefined(params)?params:null,
						"clientTaskId" : cTaskId
					};
				}
				state = WS_STATE_OPENING;
				ws.send(angular.toJson(data));
			}
		};

		this._openResponse = function(taskmanager,msg) {
			if(state===WS_STATE_OPENING) {
				if(msg.result===RESPONSE_OK) {
					thisObj.id = msg.taskID;
					if(thisObj.closeData===null) {
						state = WS_STATE_WAITINGEVT;
					}
					else {
						//El evento de cierre ha llegado antes que la respuesta de apertura.
						closeDefer.resolve(thisObj);
						purge(taskmanager);
					}
					openDefer.resolve(thisObj);
				}
				else {
					openDefer.reject(msg);
					purge(taskmanager);
				}
			}			
		};

		this._closeEvent = function(taskmanager,msg) {
			if(state===WS_STATE_OPENING||state===WS_STATE_WAITINGEVT) {
				thisObj.closeData = msg.datos;
				if(state===WS_STATE_WAITINGEVT) {
					closeDefer.resolve(thisObj);
					purge(taskmanager);
				}
			}
		};

		function purge(taskmanager) {
			taskmanager.unregisterTask(cTaskId);						
		}

		function getActivationTaskId() {
			if(subtask) {
				return angular.isDefined(parentTaskID)?parentTaskID:getIDProceso();
			}
			else {
				return thisObj.id;
			}
		}

		function errorCallBack(reason) {
			return $q.reject(internalError(reason));
		}

		this.activate = function() {
			var parametros = {
				"tipoOperacion" : "activate",
				"taskID" : getActivationTaskId(),
				"version" : 2
			};
			$http(getPOSTRequest(getComURL($location),parametros))
				.then(function(res) {
						if(res.data.result===RESPONSE_OK) {
							return;
						}
						else {
							return $q.reject(res.data);
						}
				},errorCallBack);
		};
	}

	function Proceso($http,$q,$location) {
		var taskmanager = angular.isDefined(WebSocket)?new WSTaskManager($http,$q,$location):null;

		function errorCallBack(reason) {
			return $q.reject(internalError(reason));
		}

		/**
		 * Abre un proceso del escritorio en una nueva tarea.
		 * <h3>Argumentos</h3>
		 * <table>
		 * <tbody>
		 * <tr>
		 * <td>Parámetro</td>  <td>Tipo</td>    <td>Detalles</td>
		 * </tr>
		 * <tr>
		 * <td>code</td>       <td>String</td>  <td>Código del proceso que se desea abrir. Los códigos de proceso los define la aplicación que hospeda el SWL.</td>
		 * </tr>
		 * <tr>
		 * <td>datos</td>      <td>object</td>  <td>Objeto con los datos de entrada que recibirá el proceso identificado en el parámetro anterior.
		 *                                      <p>Por ejemplo, si el proceso necesita los parámetros cuenta y cliente, el objeto tendría las siguientes propiedades:
		 *                                      <pre>{"cuenta" : "20381778176010140411", "cliente" : "100023"}</pre>
		 *                                      </td>
		 * </tr>
		 * <tr>
		 * <td>onClose</td>    <td>boolean</td> <td>Si true, entonces se crea una promesa que recibirá la notificación del cierre de la tarea (ver el apartado de retorno).
		 *                                      Si false (o no se informa), entonces la promesa no será creada y el módulo no esperará la terminación de la tarea.
		 *                                      Sólo se debe utilizar true cuando se desee conocer la terminación de la tarea abierta.
		 *                                      </td>
		 * </tr>
		 * </tbody>
		 * </table>
		 *
		 * <h3>Retorno</h3>
		 * Retorna una promesa con el método estándar then.
		 * <p>Cuando la apertura funciona correctamente, se llama a la primera función del método then pasándole un objeto que
		 * representa la tarea recién abierta con las siguientes propiedades/funciones:
		 * <ul>
		 * <li>id. Identificador de la tarea/subtarea abierta.
		 * <li>closeData. Objeto con los datos retornados por el proceso abierto cuando éste termina.
		 * <li>subtask. boolean que indica si es o no una subtarea.
		 * <li>closePromise. Promesa que recibe la notificación del cierre de la tarea. Esta promesa también tiene el método estándar then. La primera función se
		 *     ejecuta cuando la tarea/proceso termina y recibe como argumento este mismo objeto que representa la tarea. La segunda función se llama
		 *     cuando algo falla al recibir el evento de cierre de la tarea. En este caso, el argumento es un objeto con las propiedades result y message. La primera
		 *     indica el código de error y la segunda una descripción del mismo.
		 * <li>activate(). Método que pone en primer plano la tarea, es decir, la pone como la tarea actual del escritorio.
		 * </ul>
		 * <p>Si la apertura falla, entonces se llama al segundo método de then pasándole un objeto con las propiedades:
		 * <ul>
		 * <li>result. Código de error.
		 * <li>message. Descripción del error.
		 * <li>detail. En algunos casos puede aparecer esta propiedad con detalles del error.
		 * </ul>
		 * <h3>Ejemplo/h3>
		 * <pre>
		 *		swl_proceso.open("NSBN0277",{"idclie":"030643126"},true)
		 *			.then(
		 *				function(task) {
		 *					task.closePromise
		 *						.then(function(task) {
		 *							showDato(task.closeData.datoSalida1);
		 *						},
		 *						function(data) {
		 *							showError(data.message);
		 *						});
		 *				},
		 *				function(data) {
		 *					showError(data.message);
		 *				}
		 *			);
		 * </pre>
		 */
		this.open = function(code, datos, onClose) {
			if(taskmanager!==null) {
				return taskmanager.open(code,datos);
			}
			else {
				var parametros = {
					"tipoOperacion" : "open",
					"codigo" : code,
					"tipoCod" : 1,
					"version" : 2,
					"evClose" : onClose===true,
					"params" : angular.isDefined(datos)?angular.toJson(datos,false):null
				};
				return $http(getPOSTRequest(getComURL($location),parametros))
						.then(function(res) {
							if(res.data.result===RESPONSE_OK) {
								return new Task($http,$q,$location,res.data.taskID,onClose,false);
							}
							else {
								return $q.reject(res.data);
							}
						},errorCallBack);
			}
		};

		/**
		 * <p>Es idéntico al método open. La única diferencia es que, en este caso, el proceso se abre dentro de una tarea existente (como subtarea).
		 * <p>La tarea donde se abre se identifica con taskID. Si se omite, entonces se utiliza el identificador retornado por la función global
		 * getIDProceso(). Esta función debe existir si queremos que la tarea Web esté identificada dentro del escritorio y poder utilizar
		 * este método para abrir procesos en la misma tarea (como subtarea) donde se está ejectando nuestra tarea Web.
		 * <p>Si se abren subtareas dentro la tarea web donde se está ejecutando este método, entonces estas subtareas tapan la tarea web son sus
		 * pantallas.
		 */
		this.openInTask = function(code, datos, onClose, taskID) {
			if(taskmanager!==null) {
				return taskmanager.openInTask(code,datos,taskID);
			}
			else {
				var parametros = {
					"tipoOperacion" : "opensub",
					"codigo" : code,
					"idProceso" : angular.isDefined(taskID)?taskID:getIDProceso(),
					"version" : 2,
					"evClose" : onClose===true,
					"params" : angular.isDefined(datos)?angular.toJson(datos,false):null
				};
				return $http(getPOSTRequest(getComURL($location),parametros))
						.then(function(res) {
							if(res.data.result===RESPONSE_OK) {
								return new Task($http,$q,$location,res.data.taskID,onClose,true);
							}
							else {
								return $q.reject(res.data);
							}
						},errorCallBack);
			}
		};

		/**
		 * <p>Cierra este proceso con los datos de terminación indicados (en formato JSON).
		 * <p>Este método sólo funcionará si la aplicación Web se está ejecutando en el navegador embebido dentro del escritorio. Los
		 * datos proporcionados llegarán al subproceso del escritorio que ha llamado a este subproceso Web.
		 */
		this.close = function(datos) {
			if(angular.isDefined(datos)) {
				window.getBankiaSWLEndData = function() {
					return angular.toJson(datos,false);
				};
			}
			window.close();
		};
	}

	function Mensaje($http,$q,$location) {
		function getURL() {
			return $location.protocol()==="https"?
				"https://localhost:40010/mensaje":
				"http://localhost:40009/mensaje";
		}

		/**
		 * Muestra un mensaje en el área de mensajes del escritorio.
		 * <h3>Argumentos</h3>
		 * <table>
		 * <tbody>
		 * <tr>
		 * <td>Parámetro</td>     <td>Tipo</td>    <td>Detalles</td>
		 * </tr>
		 * <tr>
		 * <td>mensaje</td>       <td>String</td>  <td>Mensaje que se desea mostrar en el área de mensajes.</td>
		 * </tr>
		 * <tr>
		 * <td>taskID</td>        <td>String</td>  <td>Opcional. Identificador de la tarea que está mostrando el mensaje. Si se omite, el identificador
		 *                                         se optiene llamando a la función global getIDProceso.
		 *                                         </td>
		 * </tr>
		 * </tbody>
		 * </table>
		 *
		 * <h3>Retorno</h3>
		 * Retorna una promesa con el método estándar then.
		 * <p>Si el mensaje se publica correctamente, se llama a la primera función. Si falla, se llama a la segunda con un objeto con las propiedades:
		 * <ul>
		 * <li>result. Código de error.
		 * <li>message. Descripción del error.
		 * <li>detail. En algunos casos puede aparecer esta propiedad con detalles del error.
		 * </ul>
		 */
		this.area = function(mensaje, taskID) {
			var parametros = {
				"tipoOperacion" : "areaMensajes",
				"mensaje" : mensaje,
				"idTarea" : angular.isDefined(taskID)?taskID:getIDProceso()
			};
			return $http(getPOSTRequest(getURL(),parametros))
					.then(function(res) {
						if(res.data.result===RESPONSE_OK) {
							return;
						}
						else {
							return $q.reject(res.data);
						}
					},errorCallBack);
		};
	}

	angular.module("bankia-swl",[])
	.service('swl_proceso', ["$http","$q","$location",Proceso])
	.service('swl_msg', ["$http","$q","$location",Mensaje]);
}());
