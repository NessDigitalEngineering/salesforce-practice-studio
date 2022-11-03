/**
 * @author Trinesh D
 * @date   10/19/2022
 * @description Apex controller for QuickLinks component
 */
public with sharing class QuickLinkController {
    /*******************************************************************************************************
    * @description This method fetches records from custom metadata
    * @return collection of mdt records
    */
    @AuraEnabled( cacheable=true )  
    public static  Map<String,List<Quick_Links_Setting__mdt>> fetchQuickLinksList() {
        Map<String,List<Quick_Links_Setting__mdt>> quickLinkMap=new Map<String,List<Quick_Links_Setting__mdt>>();
        List < Quick_Links_Setting__mdt > fetchMetadata = [ SELECT Id,Button_Label__c,Section_Name__c,Order__c,Redirection_URL__c,Component_Action_Type__c,Navigation_Type__c,Component_Name__c,Custom_Permission__c  FROM Quick_Links_Setting__mdt order by Order__c];
        for(Quick_Links_Setting__mdt metaData:fetchMetadata)
        { 
            List<Quick_Links_Setting__mdt> buttonList= quickLinkMap.get(metaData.section_Name__c);
            if(buttonList==null)
            {
                buttonList=new List<Quick_Links_Setting__mdt>();
                if(evaluateCustomPermission(metaData)){
                    buttonList.add(metaData);
                    quickLinkMap.put(metaData.section_Name__c,buttonList);
                }
            }
            else 
            {
                if(evaluateCustomPermission(metaData)){
                    buttonList.add(metaData);
                    quickLinkMap.put(metaData.section_Name__c,buttonList);
                }
            }
        }
        return quickLinkMap;
    }

    /*******************************************************************************************************
    * @description This method evaluates custom permissions
    * @return Boolean
    */
    private static Boolean evaluateCustomPermission(Quick_Links_Setting__mdt metaData){
        if(String.isNotBlank(metaData.Custom_Permission__c) && FeatureManagement.checkPermission(metaData.Custom_Permission__c)){
            return true;
        }
        else if(String.isNotBlank(metaData.Custom_Permission__c) && !FeatureManagement.checkPermission(metaData.Custom_Permission__c)){
            return false;
        }
        else{
            return true;
        }
    }
}