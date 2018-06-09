import DS from 'ember-data';

export default DS.Model.extend({
    lista: DS.belongsTo('roll-call'),
    empleado: DS.belongsTo('acount'),
    asistencia: DS.attr('boolean'),
    evidenciaURL: DS.attr('string')
});
