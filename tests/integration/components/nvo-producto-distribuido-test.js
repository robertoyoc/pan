import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nvo-producto-distribuido', 'Integration | Component | nvo producto distribuido', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{nvo-producto-distribuido}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#nvo-producto-distribuido}}
      template block text
    {{/nvo-producto-distribuido}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
