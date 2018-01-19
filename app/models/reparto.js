import DS from 'ember-data';
import { computed } from "@ember/object";


const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dias = ['Domingo','Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ];

export default DS.Model.extend({
	sucursal: DS.belongsTo('sucursal'),
	distribuciones: DS.hasMany('distribucion'),
	fecha: DS.attr('string'),
	dia: computed('fecha', function(){
		let date = new Date(parseInt(this.get('fecha')))

		return dias[date.getDay()] + " " + date.getDate()+ "-" +meses[date.getMonth()] + "-" + date.getFullYear(); 
	}),	
	hora: computed('fecha', function(){
		let date = new Date(parseInt(this.get('fecha')))

		let minutes = (date.getMinutes()>10)?date.getMinutes(): "0" + date.getMinutes()
		return date.getHours() + ":" + minutes;
	})
});
