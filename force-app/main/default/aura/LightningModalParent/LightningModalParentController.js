
({
	openModal : function(component, event, helper) {
        //Dynamic creation of lightningModalChild component and appending its markup in a div
       helper.openModalhandler(component, event, helper);

	},

    handleReceiveMessage: function (component, event, helper) {
        helper.messageHandler(component, event, helper);
    }
      
})
