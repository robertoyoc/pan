import Component from '@ember/component';

export default Component.extend({
	init(){
		this._super(...arguments)
		this.set('cantidad',0);
	},
	actions: {
		mas(){
			this.set('cantidad', this.get('cantidad')+1);
		},
		menos(){
			if(this.get('cantidad')>=1)
				this.set('cantidad', this.get('cantidad')-1);

		}
	}
});
