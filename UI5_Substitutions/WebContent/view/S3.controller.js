jQuery.sap.declare("ui5.substitutions.view.S3");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseDetailController.extend("ui5.substitutions.view.S3", {


	onInit: function() {
		
		var that = this;
		
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oBundle 	= this.oApplicationFacade.getResourceBundle();		
		this.oView		= this.getView();
		this.maxDatesRange = 365;
		this.viewModes = {
				"DisplaySubstitute" : 1,
				"NewSubstitute" 	: 2,
				"EditSubstitute" 	: 3
			};
		this.oRouter.attachRouteMatched(function(oEvent) {
			var page = that.oView.byId("pageDetail");
			page.scrollTo(0);
			var context = new sap.ui.model.Context(that.oView.getModel(), "/" + oEvent.getParameter("arguments").contextPath);
			that.oView.setBindingContext(context);
			this._setBusyOn();
			if (oEvent.getParameter("name") === "detail") {
				that.viewMode = that.viewModes.DisplaySubstitute;
				this.getSubstituteData(context);
			}
			if (oEvent.getParameter("name") === "new") {
				that.viewMode = that.viewModes.NewSubstitute;
				this.getUserCollection(context);
				this.cleanUpForm();
				this.createEmptySubstituteModel();
			}
			if (oEvent.getParameter("name") === "edit") {
				that.viewMode = that.viewModes.EditSubstitute;
				this.getUserCollection(context);
				this.getSubstituteData(context);
				this.createEmptySubstituteModel();
			}
			this.setUserInputProperty(that.oView.byId("iUsernameTo"), that.viewMode);
			this.setActiveCheckBoxProperty(that.oView.byId("cbActive"), that.viewMode);		
			this.setDatesProperties(that.viewMode);
			
			this._setBusyOff();
			
			this.setHeaderFooterOptions(this.createHeaderFooterOptions());
			
		}, this);		
		
		
	},		
	
	createEmptySubstituteModel : function() {
		this.CreateSubstituteModel = new sap.ui.model.json.JSONModel({
			"UsernameFrom" : "",
			"UsernameFullnameFrom" : "",
			"UsernameTo" : "",
			"UsernameFullnameTo" : "",
			"DateFrom" : "",
			"DateTo" : "",
			"Active" : ""
		});
	},

	getSubstituteData : function(context){
		var that = this;
		this.oDataModel.read(context.sPath, context, null, false, function(oData){
			
			var oSubstituteModel = new sap.ui.model.json.JSONModel(oData);
			that.oView.setModel(oSubstituteModel,"SubstituteDetails");
		
		}, function(oError){
			
		}); 
	},
	
	getUserCollection : function(context){
		var that = this;
		this.oDataModel.read("/UserCollection", context, null, false, function(oData){
			
			var oUserCollectionModel = new sap.ui.model.json.JSONModel(oData);
			that.oView.setModel(oUserCollectionModel,"UserCollection");
		
		}, function(oError){
			
		}); 
		
	},
	
	setDatesProperties : function(viewMode){
		var that = this;
		var oSwitch = that.oView.byId("swCalendar");

		if(viewMode == that.viewModes.DisplaySubstitute){
			oSwitch.setEnabled(true);
			oSwitch.setState(true);
			
			var dateFrom = that.oView.getModel("SubstituteDetails").getData().DateFrom;
			var dateTo = that.oView.getModel("SubstituteDetails").getData().DateTo;
	
			// Special Case 
			var nbDays = that.calculateDaysBetween(dateFrom, dateTo);
			if(nbDays > that.maxDatesRange){
				oSwitch.setState(false);
				that.setSwitchTextMsg(true);
				that.setDatesDisplay(false, viewMode, true);
			}else{
				that.setSwitchTextMsg(false);
				that.setDatesDisplay(true, viewMode, false);
			}
			
		} else if(viewMode == that.viewModes.NewSubstitute){
			oSwitch.setEnabled(true);
			oSwitch.setState(true);
			that.setDatesDisplay(true, viewMode, false);
			that.setSwitchTextMsg(false);
		} else if(viewMode == that.viewModes.EditSubstitute){
			oSwitch.setEnabled(true);
			oSwitch.setState(true);
			
			var dateFrom = that.oView.getModel("SubstituteDetails").getData().DateFrom;
			var dateTo = that.oView.getModel("SubstituteDetails").getData().DateTo;
	
			// Special Case 
			var nbDays = that.calculateDaysBetween(dateFrom, dateTo);
			if(nbDays > that.maxDatesRange){
				oSwitch.setState(false);
				that.setSwitchTextMsg(true);
				this.setDatesDisplay(false, viewMode, true);
			}else{
				that.setSwitchTextMsg(false);
				that.setDatesDisplay(true, viewMode, false);
			}
			
			
		}	

	},
	
	setDatesDisplay : function(isBoolCalendarSwitchOn, viewMode, boolNoBindCalendar){
		var that = this;
		that.setDateCalendarProperty(that.oView.byId("calDate"), isBoolCalendarSwitchOn, viewMode);
		that.setDateCalendarDataBind(that.oView.byId("calDate"), isBoolCalendarSwitchOn, viewMode, boolNoBindCalendar);
		that.setDatesInputProperty(isBoolCalendarSwitchOn, viewMode);
	},	
	
	setDateCalendarProperty : function(calendar, isBoolCalendarSwitchOn, viewMode){
		if(isBoolCalendarSwitchOn === true){
			calendar.setVisible(true)
			
			if(jQuery.device.is.phone == true){
				calendar.setMonthsPerRow(1);
				calendar.setMonthsToDisplay(3);
			}else if(jQuery.device.is.tablet == true){
				calendar.setMonthsPerRow(2);
				calendar.setMonthsToDisplay(4);
			}else{
				calendar.setMonthsPerRow(3);
				calendar.setMonthsToDisplay(3);
			}
		}else if(isBoolCalendarSwitchOn === false){
			calendar.setVisible(false);
		}

	},	
	
	setDateCalendarDataBind : function(calendar, isBoolCalendarSwitchOn, viewMode, boolNoBindCalendar){
		var that = this;
		if(isBoolCalendarSwitchOn === true){
			if(viewMode == that.viewModes.NewSubstitute){
				calendar.setCurrentDate(new Date());
				calendar.unselectAllDates();
			}else{
				if(boolNoBindCalendar === false){
					calendar.unselectAllDates();
					var dateFrom = that.oView.getModel("SubstituteDetails").getData().DateFrom;
					var dateTo = that.oView.getModel("SubstituteDetails").getData().DateTo;
					calendar.toggleDatesRangeSelection(dateFrom, dateTo, true);
					calendar.setCurrentDate(dateFrom);	
				}
			}

		}else if(isBoolCalendarSwitchOn === false){
			
		}
	},
	
	setDatesInputProperty : function(isBoolCalendarSwitchOn, viewMode){
		var that = this;
		var oDateLabelFrom = that.oView.byId("lDateFrom");
		var oDateLabelTo = that.oView.byId("lDateTo");
		var oDateInputFrom = that.oView.byId("dpDateFrom");
		var oDateInputTo = that.oView.byId("dpDateTo");
		
		if(isBoolCalendarSwitchOn === true){
			oDateLabelFrom.setVisible(false);
			oDateLabelTo.setVisible(false);
			oDateInputFrom.setVisible(false);
			oDateInputTo.setVisible(false);
			oDateInputFrom.setEnabled(false);
			oDateInputTo.setEnabled(false);
			oDateInputFrom.setEditable(false);
			oDateInputTo.setEditable(false);
		}else if(isBoolCalendarSwitchOn === false){
			oDateLabelFrom.setVisible(true);
			oDateLabelTo.setVisible(true);
			oDateInputFrom.setVisible(true);
			oDateInputTo.setVisible(true);
			oDateInputFrom.setEnabled(true);
			oDateInputTo.setEnabled(true);
			
			if(viewMode == that.viewModes.DisplaySubstitute){
				oDateInputFrom.setEditable(false);
				oDateInputTo.setEditable(false);
			} else if(viewMode == that.viewModes.NewSubstitute){
				oDateInputFrom.setEditable(true);
				oDateInputTo.setEditable(true);
				oDateInputFrom.setDateValue(new Date());
				oDateInputTo.setDateValue(new Date());
			} else if(viewMode == that.viewModes.EditSubstitute){
				oDateInputFrom.setEditable(true);
				oDateInputTo.setEditable(true);				
			}			
			
		}
	},
	
	setUserInputProperty : function(input, viewMode){
		var that = this;
		if(viewMode == that.viewModes.DisplaySubstitute){
			input.setEditable(false);
			input.setShowValueHelp(false);
			input.setValueHelpOnly(true);
		} else if(viewMode == that.viewModes.NewSubstitute){
			input.setEditable(true);
			input.setShowValueHelp(true);
			input.setValueHelpOnly(true);
		} else if(viewMode == that.viewModes.EditSubstitute){
			input.setEditable(false);
			input.setShowValueHelp(false);
			input.setValueHelpOnly(true);
		}
	},
	
	setActiveCheckBoxProperty : function(input, viewMode){
		var that = this;
		if(viewMode == that.viewModes.DisplaySubstitute){
			input.setEnabled(false);
		} else if(viewMode == that.viewModes.NewSubstitute){
			input.setEnabled(true);
		} else if(viewMode == that.viewModes.EditSubstitute){
			input.setEnabled(true);
		}
	},
	
	setSwitchTextMsg : function(oBoolSet){
		var that = this;
		if(oBoolSet === true){
			that.oView.byId("txtSwitchMsg").setVisible(true);
			that.oView.byId("txtSwitchMsg").setText(that.oBundle.getText("error.check.rangeTooLarge"));
			that.oView.byId("swCalendar").setEnabled(false);
		}else if(oBoolSet === false){
			that.oView.byId("txtSwitchMsg").setVisible(false);
			that.oView.byId("txtSwitchMsg").setText('');
			that.oView.byId("swCalendar").setEnabled(true);
		}
	},
	
	onSwitchChange : function(oEvent){
		this.setDatesDisplay(oEvent.getParameter("state"), this.viewMode, true);
		if(this.viewMode === this.viewModes.DisplaySubstitute && oEvent.getParameter("state") === false){
		}else{
			this.setDatesBindingToDisplayedControl(oEvent.getParameter("state"));
		}
	},
	
	setDatesBindingToDisplayedControl : function(isBoolCalendarSwitchOn){
		var that = this;
		var oInputDateFrom = that.oView.byId("dpDateFrom");
		var oInputDateTo = that.oView.byId("dpDateTo");
		var oCalendar = that.oView.byId("calDate");
		if(isBoolCalendarSwitchOn === true){
			oCalendar.unselectAllDates();
			oCalendar.toggleDatesRangeSelection(oInputDateFrom.getDateValue(), oInputDateTo.getDateValue(), true);
			oCalendar.setCurrentDate(oInputDateFrom.getDateValue());	
		}else if(isBoolCalendarSwitchOn === false){
			 
			if(oCalendar.getSelectedDates().length > 0){
				var dateArray = that.sortCalendarDatesArray(oCalendar.getSelectedDates());
				
				oInputDateFrom.setDateValue(new Date(dateArray[0]));
				oInputDateTo.setDateValue(new Date(dateArray[dateArray.length - 1]));
			}else{
				oInputDateFrom.setDateValue(new Date());
				oInputDateTo.setDateValue(new Date());
			}
		}
	},
	
	onDateChanged : function(oEvent){
		var that = this;
		var dateTo = that.oView.byId("dpDateTo").getDateValue();
		var dateFrom = that.oView.byId("dpDateFrom").getDateValue();
		
		if(dateTo == null && dateFrom != null){
			that.oView.byId("dpDateTo").setDateValue(dateFrom);
			that.setSwitchTextMsg(false);
		}else if(dateTo != null && dateFrom == null){
			that.oView.byId("dpDateFrom").setDateValue(dateTo);
			that.setSwitchTextMsg(false);
		}else if(dateTo != null && dateFrom != null){
	 
			 if(Date.parse(dateTo) < Date.parse(dateFrom)){
		 			var	errMessage = this.oBundle.getText("error.check.inverseDate");
					this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
					that.oView.byId("dpDateTo").setDateValue(dateFrom);
					that.setSwitchTextMsg(false);
			 }else{
				var nbDays = that.calculateDaysBetween(dateFrom, dateTo);
				if(nbDays > that.maxDatesRange){
					that.setSwitchTextMsg(true);
				}else{
					that.setSwitchTextMsg(false);
				}
			 }
			
		}
	},
	
	calculateDaysBetween : function( date1, date2 ) {
		  //Get 1 day in milliseconds
		  var one_day=1000*60*60*24;

		  // Convert both dates to milliseconds
		  var date1_ms = date1.getTime();
		  var date2_ms = date2.getTime();

		  // Calculate the difference in milliseconds
		  var difference_ms = date2_ms - date1_ms;
		    
		  // Convert back to days and return
		  return Math.round(difference_ms/one_day); 
	},
	

	onValueHelpRequest : function(field, title, path, displayvalue, descval, output, filterby, modelName) {
		var title1 = this.oBundle.getText(title);
		var title2 = displayvalue;
		var filter = filterby;
		var Field = this.getView().byId(field);
		// Handling of both confirm and cancel; clear the filter
		var handleClose = function(oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				if (output === "both")
					Field.setValue(oSelectedItem.getDescription() + " (" + oSelectedItem.getTitle() + ")");
				else
					Field.setValue(oSelectedItem.getTitle());
			}
			oEvent.getSource().getBinding("items").filter([]);
		};

		this._valueHelpSelectDialog = new sap.m.SelectDialog({
			title : title1,
			items : {
				id : "listAgents",
				path : path,
				template : new sap.m.StandardListItem({
					title : title2,
					description : descval,
					active : true
				})
			},
			search : function(oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter(filter, sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			liveChange : function(oEvent){
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter(filter, sap.ui.model.FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			confirm : handleClose,
			cancel : handleClose
		});
		this._valueHelpSelectDialog.setModel(this.getView().getModel(modelName));
		this._valueHelpSelectDialog.open();
	},
	
	onUserValueHelpRequest : function(oEvent) {
		this.onValueHelpRequest("iUsernameTo", "matchcode.user.title", "/results", "{Username}", "{Fullname}", "single", "Fullname", "UserCollection");
	},
	
	cleanUpForm : function(){
		this.oView.byId("iUsernameTo").setValue("");
		this.oView.byId("cbActive").setSelected(false);
	},	
	
	createHeaderFooterOptions : function() {
		var that = this;
		
		// Display Mode
		if(this.viewMode === that.viewModes.DisplaySubstitute){
			
			return {
				sI18NDetailTitle : "page.detail.title.display",
				oEditBtn : {
					sI18nBtnTxt : "page.detail.footer.edit",
					onBtnPressed : jQuery.proxy(this._handleEdit, that)
				},
				buttonList : [{
					sI18nBtnTxt : "page.detail.footer.delete",
					onBtnPressed : jQuery.proxy(this._handleDelete, that),
					bDisabled   : false,
				}],
				onBack : jQuery.proxy(function() {
					var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep link
					if (sDir && sDir !== "Unknown") {
						window.history.go(-1);
					} else {
						this.oRouter.navTo("master", {}, true);
					}
				}, this)
				
			};
			
		// Edit Mode
		}else if(this.viewMode === that.viewModes.EditSubstitute){
			
			return {
				sI18NDetailTitle : "page.detail.title.edit",
				oPositiveAction : {
					sI18nBtnTxt : "page.detail.footer.submit",
					onBtnPressed : jQuery.proxy(this._handleSubmit, that)
				},
				buttonList : [{
					sI18nBtnTxt : "page.detail.footer.cancel",
					onBtnPressed : jQuery.proxy(this._handleNavBack, that)
				}],
				onBack : jQuery.proxy(function() {
					var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep
					// link situation
					if (sDir && sDir !== "Unknown") {
						window.history.go(-1);
					} else {
						this.oRouter.navTo("detail", {
							contextPath : this.oView.getBindingContext().sPath.substr(1)
						}, true);
					}
				}, this)
				
			};
			
		// New Mode
		}else if(this.viewMode == that.viewModes.NewSubstitute){
			
			return {
				sI18NDetailTitle : "page.detail.title.new",
				oPositiveAction : {
					sI18nBtnTxt : "page.detail.footer.submit",
					onBtnPressed : jQuery.proxy(this._handleSubmit, that)
				},
				buttonList : [{
					sI18nBtnTxt : "page.detail.footer.cancel",
					onBtnPressed : jQuery.proxy(this._handleNavBack, that),
					enabled : true
				}],
				onBack : jQuery.proxy(function() {
//							window.history.go(-1);
							this.oRouter.navTo("master", {}, true);
				}, this)
				
			};			
				
		}else{
			
			return {
				sI18NDetailTitle : "page.detail.title.display",
				oEditBtn : {
					sI18nBtnTxt : "page.detail.footer.edit",
					onBtnPressed : jQuery.proxy(this._handleEdit, that)
				},
				buttonList : [{
					sI18nBtnTxt : "page.detail.footer.delete",
					onBtnPressed : jQuery.proxy(this._handleDelete, that),
				}],
				onBack : jQuery.proxy(function() {
					var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); 
					if (sDir && sDir !== "Unknown") {
						window.history.go(-1);
					} else {
						this.oRouter.navTo("master", {}, true);
					}
				}, this)
				
			};
			
		}

	},
	
	_handleSubmit : function(oEvent) {
		var formData = this.updateModelByForm(this.viewMode);
		if(formData){
			this._handleCreateCall(oEvent, this.viewMode);
		}
	},

	updateModelByForm : function(viewMode) {
		
		// Check User Input
		var allUsers = this.oView.getModel("UserCollection").getData().results;
		var inputUserValue = this.oView.byId("iUsernameTo").getValue();
		if(inputUserValue == ""){
			var	errMessage = this.oBundle.getText("error.check.noUser");
			this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
        	return false;
		}else{
			var fromListedUser = false;
	        for (var i = 0; i < allUsers.length; i++) {
	            if(allUsers[i].Username == inputUserValue){
	            	fromListedUser = true; 
	            	break;
	            }
	          }	
	        
	        if(fromListedUser == false){
				var	errMessage = this.oBundle.getText("error.check.invalidUser", inputUserValue);
				this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
	        	return false;
	        }
		}
		
		// Check Date Selection
		
		var currentDate = new Date().setHours(0,0,0,0);
		var dateToCompare;
        var dateFrom;
        var dateTo;
		
		if(this.oView.byId("swCalendar").getState() === true){ // if switchCalendar On
			
			if(this.oView.byId("calDate").getSelectedDates() == 0){
				var	errMessage = this.oBundle.getText("error.check.dateSelection");
				this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
	        	return false;
			}
			 			
			 var dateArray = this.sortCalendarDatesArray(this.oView.byId("calDate").getSelectedDates());
			 
			 var selectDateFirstParsed = dateArray[0];
			 var selectDateLastParsed = dateArray[dateArray.length - 1];	
	         
        	 dateFrom = selectDateFirstParsed;
             dateTo = selectDateLastParsed;
             dateToCompare = Date.parse(selectDateLastParsed);
			
		}else if(this.oView.byId("swCalendar").getState() === false){ // if switchCalendar Off
			 
			 var datetoToCompare = Date.parse(this.oView.byId("dpDateTo").getDateValue());
			 var datefromToCompare = Date.parse(this.oView.byId("dpDateFrom").getDateValue());
			 
			 if(datefromToCompare > datetoToCompare){
		 			var	errMessage = this.oBundle.getText("error.check.inverseDate");
					this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
		        	return false;
			 }
			 
			 dateFrom = this.oView.byId("dpDateFrom").getDateValue().toISOString();
			 dateTo = this.oView.byId("dpDateTo").getDateValue().toISOString();
			 dateToCompare = datetoToCompare;
			 
		};

         // Check past date? 
         if(currentDate > dateToCompare){
 			var	errMessage = this.oBundle.getText("error.check.pastDate");
			this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
        	return false;
         }

         // Check OK -> Model binding
         this.CreateSubstituteModel.setProperty("/UsernameTo", inputUserValue);

         var inputActive = this.oView.byId("cbActive").getSelected() == true ? "X" : "";
         this.CreateSubstituteModel.setProperty("/Active", inputActive);
         
    	 this.CreateSubstituteModel.setProperty("/DateFrom", dateFrom.substr(0, 22));
    	 this.CreateSubstituteModel.setProperty("/DateTo", dateTo.substr(0, 22));

    	 return true;
     
	},
	
	sortCalendarDatesArray : function(oCalendarDatesArray){
		var dateArray = [];
		var date = null;

		 for (var i = 0; i < this.oView.byId("calDate").getSelectedDates().length; i++){
			 date = new Date(Date.parse(oCalendarDatesArray[i])).toISOString();
			 dateArray.push(date);
		 }
		 dateArray.sort();
		
		return dateArray;
	},
	
	_handleCreateCall : function(oEvent, viewMode) {
		var that = this;
		that._setBusyOn();
		this.oDataModel.setRefreshAfterChange(false);
		
		if (viewMode === this.viewModes.NewSubstitute){
			this.oDataModel.create('/SubstituteCollection', this.CreateSubstituteModel.getData(), null, 
					function(response) {
						that._setBusyOff();
						var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView);
						var oComponent = sap.ui.component(sComponentId);
						
//						if(viewMode == that.viewModes.NewSubstitute){
							that.detailContextPath = response.__metadata.uri.substring(response.__metadata.uri.lastIndexOf("/"), response.__metadata.uri.length);
//						}else if(viewMode == that.viewModes.EditSubstitute){
//							that.detailContextPath = that.oView.getBindingContext().sPath;
//						}
						
						that.oDataModel.attachRequestCompleted(that, function() {
//							var detailContextPath = that.oView.getBindingContext().sPath;
							oComponent.oEventBus.publish("ui5.substitutions", "RefreshCreate", that.detailContextPath);
							}, that);
						that.oDataModel.setRefreshAfterChange(true);
			
						that.oDataModel.refresh(true);
			
						that.showMessageToast(that.oBundle.getText("submit.msg"));

				// that._handleNavBack();
			}, function(oError) {
				that.oDataModel.setRefreshAfterChange(true);
				if (that.oDataModel.hasPendingChanges()) {
					that.oDataModel.refresh(true);
				}
				that._onRequestFailed(oError);
				that._setBusyOff();
			});
		}else if(viewMode === this.viewModes.EditSubstitute){
			
			var oContextPath = this.oView.getBindingContext().sPath;
			var oParams = {};
			oParams.fnSuccess = function(response){
				
				that.oDataModel.create('/SubstituteCollection', that.CreateSubstituteModel.getData(), null, 
						function(response) {
							that._setBusyOff();
							var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView);
							var oComponent = sap.ui.component(sComponentId);
							
							that.detailContextPath = response.__metadata.uri.substring(response.__metadata.uri.lastIndexOf("/"), response.__metadata.uri.length);

							
							that.oDataModel.attachRequestCompleted(that, function() {
//								var detailContextPath = that.oView.getBindingContext().sPath;
								oComponent.oEventBus.publish("ui5.substitutions", "RefreshCreate", that.detailContextPath);
								}, that);
							that.oDataModel.setRefreshAfterChange(true);
				
							that.oDataModel.refresh(true);
				
							that.showMessageToast(that.oBundle.getText("submit.msg"));

					// that._handleNavBack();
				}, function(oError) {
					that.oDataModel.setRefreshAfterChange(true);
					if (that.oDataModel.hasPendingChanges()) {
						that.oDataModel.refresh(true);
					}
					that._onRequestFailed(oError);
					that._setBusyOff();
				});
				
			};
			
			oParams.fnError = function(oError) {
				that.oDataModel.setRefreshAfterChange(true);
				if (that.oDataModel.hasPendingChanges()) {
					that.oDataModel.refresh(true);
				}
				that._onRequestFailed(oError);
				that._setBusyOff();
			};
			
			this.oDataModel.remove(oContextPath, oParams);
		}
		

	},	
	
	_handleDelete : function(oEvent) {

		
		var sDeleteMessage = this.oBundle.getText("delete.dialog.message", this.oView.getBindingContext().getProperty("UsernameFullnameTo"));

		sap.ca.ui.dialog.confirmation.open({
			question : sDeleteMessage,
			showNote : false,
			title : this.oBundle.getText("delete.dialog.title"),
			confirmButtonLabel : this.oBundle.getText("delete.dialog.title")
		}, jQuery.proxy(function(oEvent) {
			var oContextPath = this.oView.getBindingContext().sPath;
			this._handleDeleteCall(oEvent, oContextPath);
		}, this));
	},

	_handleDeleteCall : function(oResult, oContextPath) {
		var that = this;
		if (oResult.isConfirmed) {
			var oParams = {};
			oParams.fnSuccess = function() {
				
				that._setBusyOff();
				var sComponentId = sap.ui.core.Component.getOwnerIdFor(that.oView);
				var oComponent = sap.ui.component(sComponentId);

				oComponent.oEventBus.publish("ui5.substitutions", "RefreshDelete", oContextPath);
				that.oDataModel.setRefreshAfterChange(true);

				
				sap.ca.ui.message.showMessageToast(that.oBundle.getText("delete.msg"));
			};
			oParams.fnError = function(oError) {
				that.oDataModel.setRefreshAfterChange(true);
				if (that.oDataModel.hasPendingChanges()) {
					that.oDataModel.refresh(true);
				}
				that._onRequestFailed(oError);
				that._setBusyOff();
			};

			this.oDataModel.setRefreshAfterChange(false);
			that._setBusyOn();

			this.oDataModel.remove(oContextPath, oParams);
		}
	},	
	
	_handleEdit : function(oEvent) {
		this.oRouter.navTo("edit", {
			contextPath : this.oView.getBindingContext().sPath.substr(1)
		});
	},
	_handleNavBack : function() {
		if (this.viewMode === this.viewModes.NewSubstitute) {
//			window.history.back();
			this.oRouter.navTo("master", {}, true);
		} else if (this.viewMode === this.viewModes.EditSubstitute) {
			this.oRouter.navTo("detail", {
				contextPath : this.oView.getBindingContext().sPath.substr(1)
			});
		}
	},
	
	_setBusyOn : function() {
		if (!this.busyOn) {
			this.busyOn = true;
			sap.ca.ui.utils.busydialog.requireBusyDialog({
				text : this.oBundle.getText("LOADING")
			});
		}
	},

	_setBusyOff : function() {
		if (this.busyOn) {
			this.busyOn = false;
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}
	},
	
	showMessageBox : function(value, type) {
		sap.ca.ui.message.showMessageBox({
			type : type,
			message : value
		});

		this._setBusyOff();
	},
	
	showMessageToast : function(value) {
		sap.ca.ui.message.showMessageToast(value, {
			duration : 3000
		});
	},
	
	_onRequestFailed : function(oError) {
		this._setBusyOff();

		var errMessage = "";
		if (oError !== null && oError.response !== null && oError.response.statusCode == 412) {
			errMessage = this.oBundle.getProperty("error.concurrent.access");
		} else if (oError !== null && oError.response !== null && oError.response.body !== null) {
			var errBody = jQuery.parseJSON(oError.response.body);
			errMessage = errBody.error.message.value;
		} else {
			errMessage = this.oBundle.getText("error.validation");
		}

		this.showMessageBox(errMessage, sap.ca.ui.message.Type.ERROR);
	},	
	
});