({
	closeModal : function(component, event, helper) {
		// when a component is dynamically created in lightning, we use destroy() method to destroy it.
		helper.closeHandler(component, event, helper) ;
	},
    doinit : function(component, event, helper) { 
        helper.initHandler(component, event, helper);
        helper.createEventListeners(component);

    }
})
