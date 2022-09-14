/**
 * @author Maddileti Boya
 * @date   6/22/2022
 * @description Apex controller for credentialsSearch component
 */
public with sharing class CredentialSearchController {
	/*******************************************************************************************************
	 * @description Returns Credential__c that are based on searchKey
	 * @param searchKey,selectedRecId and userId
	 * @return List of Credential__c
	 */

	@AuraEnabled
	public static List<Credential__c> getCredentials(String searchKey, List<String> selectedRecId, String userId) {
		List<Credential__c> sObjectResultList = new List<Credential__c>();
		String query = '';
		if (selectedRecId == null)
			selectedRecId = new List<String>();

		if (String.isNotEmpty(searchKey) && searchKey.length() >= 3 && String.isNotBlank(userId)) {
			query =
				'select id,Name,Badge_Icon__c,Icon__c,(SELECT Name,Status__c,User__r.id,Badge_Icon__c FROM User_Credentials__r where User__r.Id =:userId ) from Credential__c where Name LIKE \'%' +
				searchKey.trim() +
				'%\' and ID NOT IN: selectedRecId';

			system.debug(query);
			for (Credential__c so : Database.Query(query)) {
				if (so.User_Credentials__r.isEmpty()) {
					sObjectResultList.add(so);
				}
			}
		} else {
			query =
				'select id,Name,Badge_Icon__c,Icon__c,Priority__c from Credential__c where Name LIKE \'%' +
				searchKey.trim() +
				'%\' and ID NOT IN: selectedRecId and Priority__c = null';
			system.debug(query);
			for (Credential__c so : Database.Query(query)) {
				sObjectResultList.add(so);
			}
		}

		return sObjectResultList;
	}
}
