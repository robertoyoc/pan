import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  precio: DS.attr('number'),
  categoria: DS.belongsTo('categoria'),
  unidad: DS.attr('string'),
  cantidad: DS.attr('number'),
  existencias: DS.hasMany('existence', {inverse:'producto'})
});
