@IsTest
public class TestDataFactory {
    public static User createUser(){
        User usr = new User(
                            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User'].Id,
                            LastName = 'last',
                            Email = 'puser000@amamama.com',
                            Username = 'puser000@amamama.com' + System.currentTimeMillis(),
                            CompanyName = 'TEST',
                            Title = 'title',
                            Alias = 'alias',
                            TimeZoneSidKey = 'America/Los_Angeles',
                            EmailEncodingKey = 'UTF-8',
                            LanguageLocaleKey = 'en_US',
                            LocaleSidKey = 'en_US');
        insert usr;
        return usr;
    }

    public static void assignPboAdminPermissions(User usr){
        PermissionSet ps = [SELECT Id FROM PermissionSet WHERE Name = 'Practice_Studio_Admin'];
        insert new PermissionSetAssignment(AssigneeId = usr.id, PermissionSetId = ps.Id);
    }

    public static void createCredentials(){
        insert new List<Credential__c>{new Credential__c(            
                                                            Alias__c= 'Salesforce Certified Platform Developer II',
                                                            EU_Target__c = 3,
                                                            External_ID__c = 'Platform_Developer_II',
                                                            IN_Target__c = 4,
                                                            Icon__c = 'https://res.cloudinary.com/kolaliam/image/upload/v1650355111/Salesforce%20Badges/Platform_Developer_II_mecgf5.png',
                                                            Name = 'Platform Developer II',
                                                            Program_Level__c = 'L3',
                                                            Registration_fee__c = 200,
                                                            Retake_fee__c = 100,
                                                            Status__c = 'Active',
                                                            Type__c = 'Trailhead',
                                                            URL__c = 'https://trailhead.salesforce.com/help?article=Salesforce-Certified-Platform-Developer-II-Exam-Guide',
                                                            US_Target__c = 2,
                                                            Visible_in_Partner_Community_Cert_Tab__c = true),
                                        new Credential__c(                                                           
                                                            Alias__c= 'Salesforce Certified Platform Developer II',
                                                            EU_Target__c = 3,
                                                            External_ID__c = 'Platform_Developer_I',
                                                            IN_Target__c = 4,
                                                            Icon__c = 'https://res.cloudinary.com/kolaliam/image/upload/v1650355111/Salesforce%20Badges/Platform_Developer_I_vbk3y0.png',
                                                            Name = 'Platform Developer I',
                                                            Program_Level__c = 'L2',
                                                            Registration_fee__c = 200,
                                                            Retake_fee__c = 100,
                                                            Status__c = 'Active',
                                                            Type__c = 'Trailhead',
                                                            URL__c = 'https://trailhead.salesforce.com/help?article=Salesforce-Certified-Platform-Developer-I-Exam-Guide',
                                                            US_Target__c = 2,
                                                            Visible_in_Partner_Community_Cert_Tab__c = true)};
    }

    public static User_Credential__c createUserCredentials(Id userId,Id credentialId){
        return new User_Credential__c(Credential__c = credentialId,
                                        User__c = userId,
                                        Active__c = true);
    }
}
