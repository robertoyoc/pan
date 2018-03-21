import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('teclado-numeric', 'Integration | Component | teclado numeric', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{teclado-numeric}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#teclado-numeric}}
      template block text
    {{/teclado-numeric}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
