ui5.substitutions.Conversions = {
	
		formatterStatusState: function(oStatus){
			if(oStatus == 'X'){
				return sap.ui.core.ValueState.Success;
			}else{
				return sap.ui.core.ValueState.Error;
			}
		},	
		
		formatterStatusText: function(oStatus){
			if(oStatus == 'X'){
				return 'Active';
			}else{
				return 'Inactive';
			}
		},	
		
};