public with sharing class documentsUploadController {
	@AuraEnabled
	public static String uploadDocuments(Credential_Exam_Attempt__c examAttemptRec, List<Object> fileData) {
		System.debug('examAttemptRec---' + examAttemptRec);
		System.debug('fileData---' + fileData);
		String examAttemptRecId;
		try {
			insert examAttemptRec;
			examAttemptRecId = examAttemptRec.Id;
			List<Id> listContentVersionIds = new List<Id>();
			List<ContentVersion> contentVersionRecs = new List<ContentVersion>();
			for (Object file : fileData) {
				FileDataWP newData = (FileDataWP) JSON.deserialize(JSON.serialize(file), FileDataWP.class);
				System.debug('filedata---' + newData);
				// ContentVersion contentVersionRec = new ContentVersion();
				// contentVersionRec.Title = filedata.Title;
				// contentVersionRec.PathOnClient = '/' + filedata.Title;
				// contentVersionRec.FirstPublishLocationId = examAttemptRec.Id;
				// contentVersionRec.VersionData = EncodingUtil.base64Decode(filedata.VersionData);
				// contentVersionRec.IsMajorVersion = true;
				// contentVersionRecs.add(contentVersionRec);
			}
			//insert contentVersionRecs;
			list<Database.saveResult> res = Database.insert(contentVersionRecs);
			for (Database.SaveResult saveResult : res) {
				if (saveResult.isSuccess()) {
					listContentVersionIds.add(saveResult.getId());
				}
			}
		} catch (Exception ex) {
			system.debug('Exception===>' + ex.getMessage());
		}
		return examAttemptRecId;
	}

	public class FileDataWP {
		public String Title;
		public Blob VersionData;
	}
}
