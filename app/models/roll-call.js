import DS from 'ember-data';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import moment from 'moment';

export default DS.Model.extend({
    fecha: DS.attr('string'),
    fechaUnix: computed('fecha', function() {
        return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
    }).meta({ serialize: true }),
    turno: DS.attr('string'),
    disponible: DS.attr('boolean'),
    listaAsistencia: DS.hasMany('attendance'),
    responsable: DS.belongsTo('account'),
    sucursal: DS.belongsTo('sucursal')
});