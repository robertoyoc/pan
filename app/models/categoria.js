import { computed } from '@ember/object';
import DS from 'ember-data';


export default DS.Model.extend({
  nombre: DS.attr('string')
});
