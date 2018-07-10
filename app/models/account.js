import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
  nombre: DS.attr('string'),
  apellido: DS.attr('string'),
  perfil: DS.attr('string'),
  telefono: DS.attr('string'),

  administradorDe: DS.belongsTo('sucursal', { inverse: 'administradores' }),
  cajeroDe: DS.belongsTo('sucursal', { inverse: 'cajeros' }),
  vendedorDe: DS.belongsTo('sucursal', { inverse: 'vendedores' }),

  asistencias: DS.hasMany('attendance'),

  qrCode: DS.attr('string'),
});
