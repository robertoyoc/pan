import Component from '@ember/component';

export default Component.extend({
    init(){
		this._super(...arguments)
		this.set('myCantidad',0);
	},

    actions: {
        concatNumber(number) {
            let myCant = this.get('myCantidad');
            this.set('myCantidad', 
                (myCant > 0) ? parseInt(myCant.toString() + number ): number
            );
        },

        substract(){
            let myCant = this.get('myCantidad');
            this.set('myCantidad',
                (myCant > 0) ? 
                    (myCant.toString().length > 1) ? parseInt(myCant.toString().slice(0, -1)): 0
                    : 0
            );
        },

        reset() {
            this.set('myCantidad', 0);
        }
        
    }
});
