(function () {
    'use strict';
    angular.module('app')
        .filter('formatDecimals', function () {
            return function (tipoCambio) {
                var decimales = Math.pow(10, tipoCambio.numDecimales),
                    cantidad = tipoCambio.cantidad;

                return (cantidad / decimales).toFixed(4);
            };
        })
        .filter('formatDate', function () {
            return function (date) {
                var result = '',
                    ad;
                try{
                    if(!_.isEmpty(date) && !_.isEmpty(date.valor)){
                        date = date.valor;
                        ad = new Date(date.split('-')[0],date.split('-')[1]-1,date.split('-')[2]);

                        var dd = ad.getDate();
                        var mm = ad.getMonth()+1; //January is 0!

                        var yyyy = ad.getFullYear();
                        if(dd<10){
                            dd='0'+dd;
                        }
                        if(mm<10){
                            mm='0'+mm;
                        }
                        result = dd+'/'+mm+'/'+yyyy;
                    }
                }catch(e){
                    result=date;
                }
                return result;
            };
        })
        /**
        cut: Filtro para cortar un string y añadir un final
        Uso:
            {{fila.cadena | cut:20 }}  --> Es necesario proporcionar longitud de la cadena a mostrar. Por defecto añade los siguiente caracteres al final ' ...',
            {{fila.cadena | cut:20:' ***' }} --> En este caso modifica la cadena final.

        Devuelve:
            Cadena cortada con añadido final
        **/
        .filter('cut', function () {
            return function (value, max, tail) {
                if (!value) {
                    return '';
                }

                max = parseInt(max, 10);
                if (!max) {
                    return value;  
                } 
                if (value.length <= max) {
                    return value;
                }
                value = value.substr(0, max);

                return value + (tail || ' …');
            };
        });
}());