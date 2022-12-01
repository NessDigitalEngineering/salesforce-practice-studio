/*
 * @author Lavanya Bonthala
 * @date   13/09/2022
 * @description Service Class containing methods specific to FilesUploadService
 */
public with sharing class FilesUploadService {
    /*******************************************************************************************************
     * @description This method upload files specific to object record
     * @param RecordId and filedata
     * @return show success message on file upload
     */

    public String uploadFiles(String parentRecId, list<String> filedata) {
        system.debug('Filesdata:' + filedata);
        system.debug('files size:' + filedata.size());
        try {
            if (filedata.size() > 0) {
                List<FileDataWP> files;
                List<ContentVersion> cvList = new List<ContentVersion>();
                for (string str : filedata) {
                    files = (List<FileDataWP>) JSON.deserialize(str, List<FileDataWP>.class);
                    System.debug(files);
                }

                for (FileDataWP file : files) {
                    system.debug('inside files:' + file);
                    ContentVersion conVer = new ContentVersion();
                    conVer.ContentLocation = 'S'; // S = Salesforce, E = External Files
                    conVer.VersionData = EncodingUtil.base64Decode(file.fileContent);
                    conVer.Title = file.fileName;
                    conVer.PathOnClient = file.fileName;
                    cvList.add(conVer);
                }
                database.insert(cvList);
                system.debug('cvlist:' + cvlist);
                List<ContentDocumentLink> cdList = new List<ContentDocumentLink>();
                for (ContentVersion cv : [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cvList]) {
                    ContentDocumentLink conDocLink = new ContentDocumentLink();
                    conDocLink.LinkedEntityId = parentRecId;
                    conDocLink.ContentDocumentId = cv.ContentDocumentId;
                    conDocLink.Visibility = 'AllUsers';
                    conDocLink.shareType = 'V'; // V = Viewer, C = Collaborator, I = Inferred
                    cdList.add(conDocLink);
                }
                insert cdList;
                system.debug('cdlist:' + cdList);
            } else {
                return label.RecordIdisBlank;
            }
            return 'success';
        } catch (Exception ex) {
            System.debug(ex.getMessage() + ' -> ' + ex.getStackTraceString());
            throw new AuraHandledException(ex.getMessage());
        }
    }

    public class FileDataWP {
        @TestVisible
        private String fileName;
        @TestVisible
        private String fileContent;

        public FileDataWP() {
            setFileName();
            setFileContent();
        }
        @TestVisible
        private void setFileName() {
            this.fileName = fileName;
        }
        @TestVisible
        private void setFileContent() {
            this.fileContent = fileContent;
        }
    }
}
