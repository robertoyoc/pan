import DS from 'ember-data';

export default DS.Model.extend({
	fecha: DS.attr('string'),
	maquilas: DS.hasMany('maquila')
});
