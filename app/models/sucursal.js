import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	nombre: DS.attr('string'),
	productos: DS.belongsTo('producto'), // needs to be removed
	existencias: DS.belongsTo('existence'),

	cajeros: DS.hasMany('account', { inverse: 'cajeroDe' }),
	vendedores: DS.hasMany('account', { inverse: 'vendedorDe' }),
	administradores: DS.hasMany('account', { inverse: 'administradorDe' }),

	pasesDeLista: DS.hasMany('roll-call')
});
