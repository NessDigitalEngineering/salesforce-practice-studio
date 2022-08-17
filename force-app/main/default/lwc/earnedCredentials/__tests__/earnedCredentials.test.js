import { createElement } from "lwc";
import EarnedCredentials from "c/earnedCredentials";
import earnedCredentialsData from "@salesforce/apex/UserCredentialService.getCompletedUserCredentials";
const mockData = require("./data/earnedCredentialsData.json");

describe("c-earned-credentials", () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		// Prevent data saved on mocks from leaking between tests
		jest.clearAllMocks();
	});

	describe("c-earned-credentials", () => {
		it("Test Wire Data", () => {
			earnedCredentialsData.mockResolvedValue(mockData);
			const element = createElement("c-earned-credentials", {
				is: EarnedCredentials
			});
			document.body.appendChild(element);
			element.senddata = "0051y00000Ls0uKAAR";
			earnedCredentialsData.emit(mockData);

			return Promise.resolve().then(() => {
				const text = element.shadowRoot.querySelector("div");
				expect(text.textContent).toBe("User Experience DesignerPlatform Developer II");
			});
		});

		it("Test Custom Event", () => {
			earnedCredentialsData.mockResolvedValue(mockData);
			const element = createElement("c-earned-credentials", {
				is: EarnedCredentials
			});
			document.body.appendChild(element);
			const handler = jest.fn();
			element.senddata = "0051y00000Ls0uKAAR";
			earnedCredentialsData.emit(mockData);

			let eventValue;
			element.addEventListener("fireCountEvent", handler);
			element.dispatchEvent(new CustomEvent("fireCountEvent"));
			return Promise.resolve().then(() => {
				expect(handler).toHaveBeenCalled();
			});
		});
	});
});
