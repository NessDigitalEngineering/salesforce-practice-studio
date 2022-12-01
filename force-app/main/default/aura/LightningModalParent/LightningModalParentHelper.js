
({
	openModalhandler : function(component, event, helper) {
        //Dynamic creation of lightningModalChild component and appending its markup in a div
        let componentName=component.get("v.componentName");
        let headerText= component.get('v.headerText');
		$A.createComponent( 'c:LightningModalChild', {
                'componentName' : componentName,'headerText':headerText
        },
            function(modalComponent, status, errorMessage) {
                if (status === "SUCCESS") {
                    //Appending the newly created component in div
                    let body = component.find( 'showChildModal' ).get("v.body");
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
        if (event != null) {
            const componentName = event.getParam('component');
            const headerText= event.getParam('headerText');
            component.set("v.componentName", componentName);
            component.set("v.headerText", headerText);
            let openModal = component.get('c.openModal');
            $A.enqueueAction(openModal);

          
        }
    }
})
