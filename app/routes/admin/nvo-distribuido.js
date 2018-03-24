import Route from '@ember/routing/route';

export default Route.extend({
    beforeModel() {
        /*
        this.store.createRecord('categoria', {
		 	nombre: "Lácteos",
         }).save()
         this.store.createRecord('categoria', {
		 	nombre: "Pan",
         }).save()
         this.store.createRecord('categoria', {
		 	nombre: "Enlatados",
         }).save()
         */
    },

    model(){
		return this.store.createRecord('distribuido');
	}
});
