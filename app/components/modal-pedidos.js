import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.$('.modal').modal();
  },
  actions: {
    pagar(){
      window.$('#pagar').modal('open');
    }
  }
});
