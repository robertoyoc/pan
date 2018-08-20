import DS from 'ember-data';

export default DS.Model.extend({
    fecha: DS.attr('number'),
    pago: DS.attr('number'),
    cambio: DS.attr('number'),

    venta: DS.belongsTo('venta'),
    cancelacion: DS.belongsTo('cancelar-request'),

    sucursal: DS.belongsTo('sucursal'),
});
