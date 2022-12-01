({
	closeHandler : function(component, event, helper) {
		// when a component is dynamically created in lightning, we use destroy() method to destroy it.
		component.destroy();
	},
    initHandler : function(component, event, helper) { 
        let componentName=component.get("v.componentName");
        let headerText=component.get("v.headerText");
        $A.createComponent(componentName,{
            'componentName' : componentName,'headerText':headerText
        },
        function(modalComponent, status, errorMessage) {
            if (status === "SUCCESS") {
                //Appending the newly created component in div              
                let body = component.find( 'modalId' ).get("v.body");
                body.push(modalComponent);
                component.find('modalId').set("v.body", body);
            } else if (status === "INCOMPLETE") {
                console.log('Server issue or client is offline.');
            } else if (status === "ERROR") {
                console.log('error');
            }
        }
    );
    },
    createEventListeners: function(component) {
        this.escapeListener = this.listener.onEscape.bind(component);
        document.addEventListener(this.listener.KEYUP, this.escapeListener);
    },

    removeEventListeners: function() {
        document.removeEventListener(this.listener.KEYUP, this.escapeListener);
    },
    listener: {
        KEYUP: 'keyup',
        onEscape: function(domEvent, component) {
            if (domEvent.keyCode ==27) {
                this.destroy();
            }
        }
    }
    
})
