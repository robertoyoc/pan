import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('barcode-reader', 'Integration | Component | barcode reader', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{barcode-reader}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#barcode-reader}}
      template block text
    {{/barcode-reader}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
