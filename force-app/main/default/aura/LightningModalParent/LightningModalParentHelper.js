
({
	openModalhandler : function(component, event, helper) {
        //Dynamic creation of lightningModalChild component and appending its markup in a div
        var componentName=component.get("v.componentName");
		$A.createComponent( 'c:LightningModalChild', {
                'componentName' : componentName
            },
            function(modalComponent, status, errorMessage) {
                if (status === "SUCCESS") {
                    //Appending the newly created component in div
                    var body = component.find( 'showChildModal' ).get("v.body");
                    body.push(modalComponent);
                    component.find( 'showChildModal' ).set("v.body", body);
                } else if (status === "INCOMPLETE") {
                	console.log('Server issue or client is offline.');
                } else if (status === "ERROR") {
                	console.log('error');
                }
            }
        );


	},

    messageHandler: function (component, event, helper) {
        console.log('messageHandler');
        if (event != null) {
            const componentName = event.getParam('component');
            component.set("v.componentName", componentName);
            var openModal = component.get('c.openModal');
            $A.enqueueAction(openModal);

          
        }
    }
})
