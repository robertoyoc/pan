import DS from 'ember-data';

export default DS.Model.extend({
  // nombre: DS.attr('string'),
  // apellido: DS.attr('string'),
  account: DS.attr('string'),
  perfil: DS.attr('string'),
  sucursal: DS.attr('string')

});
