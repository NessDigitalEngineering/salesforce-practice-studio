public with sharing class VoucherRequestController {
	@AuraEnabled
	public static void saveRecord(Credential_Exam_Attempt__c record) {
		System.debug('rec--' + record);
		try {
			insert record;
		} catch (Exception ex) {
			throw new AuraHandledException(ex.getMessage());
		}
	}
}
