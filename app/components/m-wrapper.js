import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  query: 'a',
  method: 'sideNav',
  options: null,
  didInsertElement () {
    var query = this.get('query');
    var method = this.get('method');
    var options = this.get('options');
    if(typeof(options)=="string")
      options = JSON.parse(options);
    this.$(query)[method](options);
    window.Materialize.updateTextFields();
  }
});
