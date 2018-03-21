import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('venta-vendedor', 'Integration | Component | venta vendedor', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{venta-vendedor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#venta-vendedor}}
      template block text
    {{/venta-vendedor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
