import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  query: 'a',
  method: 'sideNav',
  options: {
    inDuration: 0
  },
  didInsertElement () {
    var query = this.get('query');
    var method = this.get('method');
    var options = this.get('options');
    this.$(query)[method](options);
    window.$(".button-collapse").sideNav({closeOnClick: true});
  }
});
