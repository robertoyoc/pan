import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    debugger
    window.Materialize.updateTextFields()
  }
});
