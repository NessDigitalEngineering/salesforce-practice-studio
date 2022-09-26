/**
 * @author Maddileti Boya
 * @date   6/22/2022
 * @description Apex cotroller for userSearch component
 */
public with sharing class UserSearchController {
	/*******************************************************************************************************
	 * @description Returns User that based on searchKeyWord
	 * @param searchKeyWord of user
	 * @return List of User
	 */
	@AuraEnabled
	public static List<User> getUsers(String searchKeyWord) {
		String searchKey = searchKeyWord + '%';
		List<User> returnList = new List<User>();

		if (String.isNotEmpty(searchKey) && searchKey.length() >= 4) {
			List<User> lstOfUsers = [
				SELECT id, Name, Title
				FROM User
				WHERE Name LIKE :searchKey AND IsActive = TRUE
				WITH SECURITY_ENFORCED
			];
			for (User users : lstOfUsers) {
				returnList.add(users);
			}
		}
		return returnList;
	}
}
