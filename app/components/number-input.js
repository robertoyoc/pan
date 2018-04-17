import Component from '@ember/component';

export default Component.extend({
	init(){
		this._super(...arguments)
		if(!this.get('cantidad'))
			this.set('cantidad',0);
	},
	actions: {
		mas(){
			let cantidad = this.get('cantidad')
			cantidad = (typeof(cantidad)=='string')? parseInt(cantidad): cantidad;
			this.set('cantidad', cantidad+1);
		},
		menos(){
			if(this.get('cantidad')>1)
				this.set('cantidad', this.get('cantidad')-1);
		}
	}
});
