public with sharing class documentsUploadController {
	@AuraEnabled
	public static String uploadDocuments(Credential_Exam_Attempt__c examAttemptRec, String file, String fileName) {
		String examAttemptRecId;
		try {
			insert examAttemptRec;
			examAttemptRecId = examAttemptRec.Id;
			String base64File = EncodingUtil.urlDecode(file, 'UTF-8');
			ContentVersion contentVersionRec = new ContentVersion();
			contentVersionRec.Title = fileName;
			contentVersionRec.PathOnClient = '/' + fileName;
			contentVersionRec.FirstPublishLocationId = examAttemptRec.Id;
			contentVersionRec.VersionData = EncodingUtil.base64Decode(base64File);
			contentVersionRec.IsMajorVersion = true;
			insert contentVersionRec;
		} catch (Exception ex) {
			system.debug('Exception===>' + ex.getMessage());
		}
		return examAttemptRecId;
	}
}
