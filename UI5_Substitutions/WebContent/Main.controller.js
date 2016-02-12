sap.ui.controller("ui5.substitutions.Main", {

	onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");
        jQuery.sap.require("sap.ca.ui.model.type.Date");
        jQuery.sap.require("ui5.substitutions.util.Conversions");
        jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");
        jQuery.sap.require("sap.ca.ui.dialog.factory");
		sap.ca.scfld.md.Startup.init('ui5.substitutions', this);
	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}	

});