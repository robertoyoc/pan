import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nvo-producto-receta', 'Integration | Component | nvo producto receta', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{nvo-producto-receta}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#nvo-producto-receta}}
      template block text
    {{/nvo-producto-receta}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
