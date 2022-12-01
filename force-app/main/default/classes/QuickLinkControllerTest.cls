@isTest(seeAllData=false)
public with sharing class QuickLinkControllerTest {
    public static testMethod void getMetaDataListTest() {
        QuickLinkController.fetchQuickLinksList();
    }
}
