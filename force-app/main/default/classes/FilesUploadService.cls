public with sharing class FilesUploadService {
    @AuraEnabled
    public static String uploadDocuments(String credExamId, list<map<string ,object>> filedata) {
        
        List<ContentVersion> cvList = new List<ContentVersion>();
        String examAttemptRecId;
        try {
            
            if(filedata.size()>0) {   
                for(map<string , object> file : filedata) {
                    ContentVersion conVer = new ContentVersion();
                    conVer.ContentLocation = 'S'; // S = Salesforce, E = External Files
                    conVer.VersionData = EncodingUtil.base64Decode(string.valueOf(file.get('fileContent')));
                    conVer.Title = string.valueOf(file.get('fileName'));
                    conVer.PathOnClient = string.valueOf(file.get('fileName'));
                    cvList.add(conVer);
                }
                Insert cvList;

                List<ContentDocumentLink> cdList = new List<ContentDocumentLink>();
                for(ContentVersion cv : [SELECT ContentDocumentId FROM ContentVersion WHERE Id in: cvList]) {
                    ContentDocumentLink conDocLink = New ContentDocumentLink();
                    system.debug('ExamId'+credExamId);
                    conDocLink.LinkedEntityId = credExamId;
                    system.debug('EntityId:'+conDocLink.LinkedEntityId);
                    conDocLink.ContentDocumentId = cv.ContentDocumentId;
                    conDocLink.Visibility = 'AllUsers';
                    conDocLink.shareType = 'V'; // V = Viewer, C = Collaborator, I = Inferred
                    cdList.add(conDocLink);
                }
                Insert cdList;        
            } else {
                return 'record Id is Blank';
            }
            
        } catch (Exception ex) {
       	system.debug('Error Message:' +ex.getMessage() + 'at Line Number' +ex.getLineNumber() +'due to ' +ex.getCause());
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
       
        return 'Success';
    }
    
}