import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	nombre: DS.attr('string'),

	existencias: DS.hasMany('existence'),
	enviados: DS.hasMany('reparto', { inverse: 'origen' }),
	recibidos: DS.hasMany('reparto', { inverse: 'destino' }),

	cajeros: DS.hasMany('account', { inverse: 'cajeroDe' }),
	vendedores: DS.hasMany('account', { inverse: 'vendedorDe' }),
	administradores: DS.hasMany('account', { inverse: 'administradorDe' }),

	ventas: DS.hasMany('ventas'),
	cobros: DS.hasMany('cobros'),
	cancelaciones: DS.hasMany('cancelar-request'),
	pasesDeLista: DS.hasMany('roll-call')
});
