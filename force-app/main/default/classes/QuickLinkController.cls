public with sharing class QuickLinkController {
    @AuraEnabled( cacheable=true )  
    public static  Map<String,List<Quick_Links_Setting__mdt>> fetchQuickLinksList() {
        Map<String,List<Quick_Links_Setting__mdt>> quickLinkMap=new Map<String,List<Quick_Links_Setting__mdt>>();
        List < Quick_Links_Setting__mdt > fetchMetadata = [ SELECT Id,Button_Label__c,Section_Name__c,Order__c,Redirection_URL__c,Component_Action_Type__c,Navigation_Type__c,Component_Name__c  FROM Quick_Links_Setting__mdt order by Order__c];
        for(Quick_Links_Setting__mdt metaData:fetchMetadata)
        { 
            List<Quick_Links_Setting__mdt> buttonList= quickLinkMap.get(metaData.section_Name__c);
            if(buttonList==null)
            {
                buttonList=new List<Quick_Links_Setting__mdt>();
                buttonList.add(metaData);
                quickLinkMap.put(metaData.section_Name__c,buttonList);
            }
            else 
            {
                buttonList.add(metaData);
                quickLinkMap.put(metaData.section_Name__c,buttonList);
            }

        }

        return quickLinkMap;

    }
}