import DS from 'ember-data';
import { inject as service } from "@ember/service"

export default DS.Model.extend({
  nombre: DS.attr('string'),
  precio: DS.attr('number'),
  categoria: DS.attr('string'),
  unidad: DS.attr('string'),
  cantidad: DS.attr('number'),
  saveWithPath(sucursal){
  	return this.save({
  		adapterOptions: { path: `sucursals/${sucursal}` }

  	})
  },
  destroyWithPath(sucursal){
  	this.destroyRecord({
    adapterOptions: {
      include: {
        '/userFeeds/user_a/post_a': null,
        '/userFeeds/user_b/post_a': null,
      }
    }
  });
  }
});
