import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),

  distribuidos: DS.hasMany('distribuido'),
  recetas: DS.hasMany('recetas'),
});
