import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.$('.modal').modal();
  }
});
