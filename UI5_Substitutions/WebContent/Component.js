jQuery.sap.declare("ui5.substitutions.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");
jQuery.sap.require("ui5.substitutions.Configuration");
jQuery.sap.require("sap.ui.core.routing.Router");

sap.ca.scfld.md.ComponentBase.extend("ui5.substitutions.Component", {

	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD",{
		"name" 			: "UI5 Substitutions",
		"version"		: "1.0.0",
		"library"		: "ui5.substitutions",
		"includes" 		: [],
	   	"dependencies" 	: { "libs" 			: ["sap.m","sap.me"],  
	           				"components" 	: [] 
	           			  },
   			  
		"config" 		: {
							"resourceBundle" : "i18n/i18n.properties",
							"titleResource" : "UI5 Substitutions",
							"icon" : "sap-icon://approvals",
							"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/Approve_Requests.ico", //FIXME: should use F0392, but resource is not like that for W1s
							"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Requests/57_iPhone_Desktop_Launch.png", //FIXME: should use F0392, but resource is not like that for 
							"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Requests/114_iPhone-Retina_Web_Clip.png", //FIXME: should use F0392, but resource is not like that for 
							"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Requests/72_iPad_Desktop_Launch.png", //FIXME: should use F0392, but resource is not like that for 
							"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/Approve_Requests/144_iPad_Retina_Web_Clip.png", //FIXME: should use F0392, but resource is not like that for 
							"startupImage320x460" : "./resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
							"startupImage640x920" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
							"startupImage640x1096" : "./resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
							"startupImage768x1004" : "./resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
							"startupImage748x1024" : "./resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
							"startupImage1536x2008" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
							"startupImage1496x2048" : "./resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
						},
		viewpath		: "ui5.substitutions.view",
		
		masterPageRoutes: {
			"master": {
				"pattern"	: ":scenarioId:",
				"view"		: "ui5.substitutions.view.S2"
			}
		},
		
		detailPageRoutes : {
			"detail" : {
                "pattern" 	: "detail/{contextPath}",
                "view" 		: "ui5.substitutions.view.S3",
			},
			"new" : {
				"pattern" 	: "newSubstitution",
				"view" 		: "ui5.substitutions.view.S3"
			},
			"edit" : {
				"pattern" 	: "edit/{contextPath}",
				"view" 		: "ui5.substitutions.view.S3"
			}
		},
		
	}),
	
	createContent : function(){
		
		var oViewData = {component: this};
		
		var oView = sap.ui.view({
			viewName : "ui5.substitutions.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
		
		var sPrefix 	= oView.getId() + "--";
		var oEventBus 	= this.getEventBus();
		
		this.oEventBus = {
				publish : function(channelId, eventId, data) {
					channelId = sPrefix + channelId;
					oEventBus.publish(channelId, eventId, data);
				},
				subscribe : function(channelId, eventId, data, oListener) {
					channelId = sPrefix + channelId;
					oEventBus.subscribe(channelId, eventId, data, oListener);
				},
				unsubscribe : function(channelId, eventId, data, oListener) {
					channelId = sPrefix + channelId;
					oEventBus.unsubscribe(channelId, eventId, data, oListener);
				}
			};

		return oView;		
		
	}
	
});
