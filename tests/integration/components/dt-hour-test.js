import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dt-hour', 'Integration | Component | dt hour', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{dt-hour}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#dt-hour}}
      template block text
    {{/dt-hour}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
