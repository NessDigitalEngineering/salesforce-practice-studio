import { LightningElement,wire } from 'lwc';
import metaDataList from '@salesforce/apex/QuickLinkController.fetchQuickLinksList';
import { NavigationMixin } from 'lightning/navigation';
import   {MessageContext,APPLICATION_SCOPE, publish} from 'lightning/messageService';
import modalMC from '@salesforce/messageChannel/ModalMessageChannel__c';

export default class QuickLinkComponent extends NavigationMixin(LightningElement) 
{
    records;
    wiredRecords;
    error;
    mapData = [];
    @wire(MessageContext)
    context;
    @wire(metaDataList)  
    wiredRecs( value ) {

        this.wiredRecords = value;
        const { data, error } = value;

        if ( data ) {                     
                          this.mapData = Object.entries(data).map(([key, value]) => ({
                            key,
                            value: Object.entries(value).map(([index, item]) => ({ index, item })),
                          }));
            this.records = data;
            this.error = undefined;
        } else if ( error ) {

            this.error = error;
            this.records = undefined;

        }

    } 

    handleNavigation(event) {

        var url=event.currentTarget.dataset.url;
        var navigationType=event.currentTarget.dataset.navigationtype;
        var componentActionType=event.currentTarget.dataset.actiontype;
        var componentName=event.currentTarget.dataset.componentname;
        var tabName=event.currentTarget.dataset.tabName;
        console.log(navigationType,componentName,componentActionType);
        switch (navigationType)
        {
            case 'URL':
                {
                this.navigateToWebPage(url);
                break;
                }
            case 'Component':
                {
                if(componentActionType=='Navigation')
                this.navigateToComponent(componentName);
                else if(componentActionType=='Modal Popup')
                this.navigateToModal(componentName);
                break;
                }
            case 'Tab':
                {
                this.navigateToTab(tabName);
                break;
                }
                default:
                    {
                    console.log('Default Option');
                    }
        }

       
        
       
    }
    navigateToWebPage(url) {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url":url 
            }
        });
    }
    navigateToTab(tabName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                //Name of any CustomTab. Visualforce tabs, web tabs, Lightning Pages, and Lightning Component tabs
                apiName: 'Test'
            },
        });
    }
    navigateToComponent(componentName) {
        let cmpDef = {
          componentDef: componentName
        };
    
        let encodedDef = btoa(JSON.stringify(cmpDef));
        this[NavigationMixin.Navigate]({
          type: "standard__webPage",
          attributes: {
            url: "/one/one.app#" + encodedDef
          }
        });
      }

      navigateToModal(componentName) {

        let payload = {
            component: componentName
       };
        publish(this.context, modalMC, payload);
      }
}