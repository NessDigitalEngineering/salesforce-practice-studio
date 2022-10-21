import { LightningElement,wire } from 'lwc';
import metaDataList from '@salesforce/apex/QuickLinkController.fetchQuickLinksList';
import { NavigationMixin } from 'lightning/navigation';
import   {MessageContext, publish} from 'lightning/messageService';
import modalMC from '@salesforce/messageChannel/ModalMessageChannel__c';
export default class QuickLinkComponent extends NavigationMixin(LightningElement) 
{
    records;
    wiredRecords;
    error;
    mapData = [];
    @wire(MessageContext)
    context;
    //wired method to get the data from Metadata that's been configured for Section,Button Names & respective functionalities
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
//Navigation handler to redirect respective functions based on the Metadata Configration
    handleNavigation(event) {
        //On clicking of the button,the URL to which it needs to be redirected.
        let url=event.currentTarget.dataset.url;
        //Type of Navigation URL,Component 
        let navigationType=event.currentTarget.dataset.navigationtype;
        //Applicable only for Component whether redirection should be Modal Poup/Tab Navigation
        let componentActionType=event.currentTarget.dataset.actiontype;
        //Name of the component for redirection
        let componentName=event.currentTarget.dataset.componentname;
        //Applicable if the navigation is TAB type
        let tabName=event.currentTarget.dataset.tabName;
        //Label for header in Modal Popup
        let buttonLabel=event.currentTarget.dataset.buttonname;
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
                this.navigateToModal(componentName,buttonLabel);
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
    //Navigation to WebPage
    navigateToWebPage(url) {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                //URL String
                "url":url 
            }
        });
    }
     //Navigation to Tab
    navigateToTab(tabName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                //Name of any CustomTab. Visualforce tabs, web tabs, Lightning Pages, and Lightning Component tabs
                apiName: 'Test'
            },
        });
    }
    //Navigation to Component
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
//Navigation to Component through Modal Popip
      navigateToModal(componentName,buttonLabel) {
        let payload = {
            component: componentName,headerText:buttonLabel
        };
       //Event published through LMS where Aura component subscribes to invoke the modal.
        publish(this.context, modalMC, payload);
      }
}