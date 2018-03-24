import DS from 'ember-data';

export default DS.Model.extend({
<<<<<<< HEAD
	receta: DS.belongsTo('receta'),
=======
	receta: DS.hasMany('receta'),
>>>>>>> f056ac9e78827edf7f2f4c8e5453ac145b9563c1
	cantidad: DS.attr('number'),
	produccion: DS.belongsTo('produccion')
});
