import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  uid: DS.attr('string'),
  nombre: DS.attr('string'),
  apellido: DS.attr('string'),

  nombreCompleto: computed('nombre', 'apellido', function(){
    return this.get('nombre') + ' ' + this.get('apellido');
  }),

  perfil: DS.attr('string'),
  telefono: DS.attr('string'),

  administradorDe: DS.belongsTo('sucursal', { inverse: 'administradores' }),
  cajeroDe: DS.belongsTo('sucursal', { inverse: 'cajeros' }),
  vendedorDe: DS.belongsTo('sucursal', { inverse: 'vendedores' }),

  asistencias: DS.hasMany('attendance'),
  ventas: DS.hasMany('ventas'),

  qrCode: DS.attr('string'),
});
