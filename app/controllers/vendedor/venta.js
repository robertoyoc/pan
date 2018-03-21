import Controller from '@ember/controller';

export default Controller.extend({
	init(){
		this.set('cantidad',1);
	},
	actions: {
		mas(){
			this.set('cantidad', this.get('cantidad')+1);
		},
		menos(){
			if(this.get('cantidad')>1)
				this.set('cantidad', this.get('cantidad')-1);

		},
		finalizar(){
			all(
				venta.get('pedidos').invoke('save')
			).then(()=>{
				venta.save()
			})

		}
	}

});
