import DS from 'ember-data';

export default DS.Model.extend({
  value: DS.attr('number'),

  distribuidos: DS.hasMany('distribuido'),
  recetas: DS.hasMany('recetas'),
});
