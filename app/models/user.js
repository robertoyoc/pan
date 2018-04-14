import DS from 'ember-data';

export default DS.Model.extend({
	account: DS.attr('string'),
  	perfil: DS.attr('string'),
  	sucursal: DS.attr('string')

});
