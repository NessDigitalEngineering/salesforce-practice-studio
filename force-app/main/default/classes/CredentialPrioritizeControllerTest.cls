@IsTest
private class CredentialPrioritizeControllerTest {
	@TestSetup
	static void makeData() {
		TestDataFactory.createUser();
		TestDataFactory.createCredentials();
	}

	@IsTest
	private static void getRecordsTest() {
		User usr = [SELECT id FROM User WHERE Email = 'puser000@amamama.com'];
		System.runAs(usr) {
			List<Credential__c> creds = CredentialPrioritizeController.getRecords();
			System.assertEquals(1, creds.size(), 'sucsess check');
		}
	}

	@IsTest
	private static void updatePriorityTest() {
		String recId = [SELECT Id FROM Credential__c WHERE Name = 'Platform Developer I'][0].Id;
		String recJson = '[{"Id":"' + recId + '","Priority__c":2}]';
		CredentialPrioritizeController.updatePriority(recJson);
		System.assertEquals(
			2,
			[SELECT Priority__c FROM Credential__c WHERE id = :recId][0]
			.Priority__c,
			'Success check'
		);
	}
}
