import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

 inflector.irregular('unidad', 'unidades');
 inflector.irregular('costal', 'costales');


// Meet Ember Inspector's expectation of an export
export default {};