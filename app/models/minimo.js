import DS from 'ember-data';

export default DS.Model.extend({
    producto: DS.belongsTo('producto'),
    limite: DS.atrr('number')

});
