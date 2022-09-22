/**
 * @author Nitin Savanur
 * @date   9/12/2022
 * @description Apex controller for credentialPrioratize component
 */
public with sharing class CredentialPrioritizeController {
	/*******************************************************************************************************
	 * @description Returns Credential__c that have Priority set
	 * @return List of Credential__c
	 */
	@AuraEnabled
	public static List<Credential__c> getRecords() {
		try {
			return Database.query(
				'Select id, name, Badge_Icon__c,Icon__c from Credential__c where Priority__c != null order by Priority__c asc'
			);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	/*******************************************************************************************************
	 * @description Method to update Priority for Credentials
	 */
	@AuraEnabled
	public static void updatePriority(String recordList) {
		try {
			List<Credential__c> credentialList = (List<Credential__c>) JSON.deserialize(
				recordList,
				List<Credential__c>.class
			);
			Database.update(credentialList, true);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}
