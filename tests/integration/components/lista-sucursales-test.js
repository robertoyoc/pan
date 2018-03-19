import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lista-sucursales', 'Integration | Component | lista sucursales', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{lista-sucursales}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#lista-sucursales}}
      template block text
    {{/lista-sucursales}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
