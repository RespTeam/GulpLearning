jQuery.sap.declare("ui5.substitutions.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
 
if(document.location.hostname == "127.0.0.1" || document.location.hostname == "localhost"){
	if(document.location.pathname != "/"){
		this.pathname = "/" + document.location.pathname.split("/")[1] + "/";
	}else{
		this.pathname = document.location.pathname;
	}
}else{
	this.pathname = "/";
}

sap.ca.scfld.md.ConfigurationBase.extend("ui5.substitutions.Configuration", {

	oServiceParams: {
        serviceList: [
            {
                name: "ZASN_SUBSTITUTION_MANAGEMENT;mo", 
                masterCollection: "SubstituteCollection",
                serviceUrl: "/sap/opu/odata/sap/ZASN_SUBSTITUTION_MANAGEMENT;mo/", 
                isDefault: true,
                mockedDataSource: "/model/metadata.xml"
            }
        ]
    },

    getServiceParams: function () {
        return this.oServiceParams;
    },

    /**
     * @inherit
     */
    getServiceList: function () {
        return this.oServiceParams.serviceList;
    },

    getMasterKeyAttributes : function() {
        return ["Id"];
    }

});
