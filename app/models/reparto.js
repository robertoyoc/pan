import DS from 'ember-data';
import { computed } from "@ember/object";
import { isBlank } from '@ember/utils';
import moment from 'moment';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dias = ['Domingo','Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ];

export default DS.Model.extend({
	sucursal: DS.belongsTo('sucursal'),
	origin: DS.belongsTo('sucursal'),
	distribuciones: DS.hasMany('distribucion'),

	fecha: DS.attr('string'),
	fechaUnix: computed('fecha', function () {
    	return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
	}).meta({ serialize: true }),
	
	dia: computed('fechaUnix', function(){
		let date = new Date(parseInt(this.get('fechaUnix')))

		return dias[date.getDay()] + " " + date.getDate()+ "-" +meses[date.getMonth()] + "-" + date.getFullYear(); 
	}),	
	hora: computed('fechaUnix', function(){
		let date = new Date(parseInt(this.get('fechaUnix')))

		let minutes = (date.getMinutes()>10)?date.getMinutes(): "0" + date.getMinutes()
		return date.getHours() + ":" + minutes;
	})
});
