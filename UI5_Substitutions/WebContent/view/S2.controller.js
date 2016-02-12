//jQuery.sap.declare("ui5.substitutions.view.S2");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("ui5.substitutions.view.S2", {

	onInit: function() {
		
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oBundle 	= this.oApplicationFacade.getResourceBundle();
//		this.getList().setNoDataText(this.oBundle.getText("LOADING"));

		this.oServiceList = sap.ca.scfld.md.app.Application.getImpl().oConfiguration.getServiceList()[0];
		this.masterCollection = this.oServiceList.masterCollection;
		this.getData();
		
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);
		oComponent.oEventBus.subscribe("ui5.substitutions", "RefreshDelete", this._handleRefreshDelete,this);
		oComponent.oEventBus.subscribe("ui5.substitutions", "RefreshCreate", this._handleRefreshCreate, this);		
		
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
				var oItem = this.findItemByContextPath(sBindingContextPath);
				var oList = this.getList();
				var iIndex = oList.indexOfItem(oItem);
				var oNextItem = oList.getItems()[iIndex + 1];
				this._sNextDetailPath = oNextItem && oNextItem.getBindingContext(this.sModelName).getPath();
			}
		}, this);		
	},
	
	getData : function(){
		var that = this;
		var oList = this.getList();
		var oTemplate 	= oList.getItems()[0].clone();
		var oSorter 	= new sap.ui.model.Sorter("UsernameTo", false);
		oList.bindItems("/" + that.masterCollection, oTemplate, oSorter);
		
	},
	
	getDetailNavigationParameters : function(oListItem) {
		var oEntry = this.getView().getModel().getProperty(oListItem.getBindingContext().getPath());
//		if(!this.sapOrigin){
//			this.sapOrigin = oEntry.SAP__Origin;
//		}
		return {
//			SAP__Origin : this.sapOrigin,
			contextPath : oListItem.getBindingContext().getPath().substr(1)
		};
	},	
	
	onDataLoaded : function() {
		if (this.getList().getItems().length < 1) {
			this.getList().setNoDataText(this.oBundle.getText("NO_ITEMS_AVAILABLE"));
			if (!sap.ui.Device.system.phone) {
				this.showEmptyView("DETAIL_TITLE", this.oBundle.getText("NO_ITEMS_AVAILABLE"));
			}
		}
	},	
	
	_handleRefreshDelete : function(channelId, eventId, contextPath) {
		"use strict";

		setTimeout(jQuery.proxy(function() {
			this.oDataModel.refresh(true);
			
			if (this.getList().getItems().length >= 1) {
				this.selectFirstItem();
				
				this.oRouter.navTo("detail", {
					contextPath : contextPath
				}, true);			
				
			} else {
				this.showEmptyView("DETAIL_TITLE", this.oBundle.getText("NO_ITEMS_AVAILABLE"));
			}
			
		}, this),  10);
		

		
	},

	_handleRefreshCreate : function(channelId, eventId, contextPath) {
		"use strict";

        var oItem = this.findItemByContextPath(contextPath);
            if (oItem) {
                this.setListItem(oItem);
            } else {
            if (this.getList().getItems().length >= 1) {
                this.selectFirstItem();
            } else {
                this.showEmptyView();
            }
            
          }
	},	
	
	_handleNew : function() {
		this.oRouter.navTo("new", {

		});
	},	
	
	getHeaderFooterOptions : function() {
		var that = this;
		return {
			sI18NMasterTitle : "MASTER_TITLE",
			oAddOptions : {
				sI18nBtnTxt : "button.new",
				icon : "sap-icon://add",
				onBtnPressed : jQuery.proxy(this._handleNew, that),
				enabled : true
			}
		};
	}	

});