import Ember from 'ember';

export default Ember.Route.extend({

  regista: Ember.computed('model', function () {
    console.log(this.get('result'))
  })
});
