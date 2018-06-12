import DS from 'ember-data';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import moment from 'moment';

export default DS.Model.extend({
    fecha: DS.attr('string'),
    fechaUnix: computed('fecha', function() {
        return (!isBlank(this.get('fecha'))) ? moment.utc(this.get('fecha')).unix() : 0;
    }).meta({ serialize: true }),
    lista: DS.belongsTo('roll-call'),
    empleado: DS.belongsTo('account'),
    asistencia: DS.attr('boolean', {
      defaultValue: false
    }),
    evidenciaURL: DS.attr('string')
});
