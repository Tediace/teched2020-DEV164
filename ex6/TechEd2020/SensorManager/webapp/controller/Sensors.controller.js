sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IconColor",
    "sap/m/MessageToast",
    "sap/ui/model/Filter"
],
    function (Controller, IconColor, MessageToast, Filter) {
        "use strict";

        return Controller.extend("keepcool.SensorsTest.controller.Sensors", {
            onInit: function() {
                this.getSensorModel().dataLoaded().then(function() {
                    MessageToast.show(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("msgSensorDataLoaded"), { closeOnBrowserNavigation: false });
                }.bind(this));
            },
            getSensorModel: function(){
                return this.getOwnerComponent().getModel("sensorModel");
            },
            formatIconColor: function(iTemperature) {
                var oThreshold = this.getSensorModel().getProperty("/threshold")
                if (!oThreshold){
                    return IconColor.Neutral;
                } else if (iTemperature < oThreshold.heated) {
                    return IconColor.Default;
                } else if (iTemperature >= oThreshold.heated && iTemperature < oThreshold.hot) {
                    return IconColor.Critical;
                } else {
                    return IconColor.Negative;
                }
            },
            onSensorSelect: function (oEvent) {
                this._aCustomerFilters = [];
                this._aStatusFilters = [];
            
                var oBinding = this.getView().byId("sensorsList").getBinding("items"),
                    sKey = oEvent.getParameter("key"),
                    oThreshold = this.getSensorModel().getProperty("/threshold");
            
                if (sKey === "Cold") {
                    this._aStatusFilters = [new Filter("temperature/value", "LT", oThreshold.heated, false)];
                } else if (sKey === "Critical") {
                    this._aStatusFilters = [new Filter("temperature/value", "BT", oThreshold.heated, oThreshold.hot, false)];
                } else if (sKey === "Warning") {
                    this._aStatusFilters = [new Filter("temperature/value", "GT", oThreshold.hot, false)];
                } else {
                    this._aStatusFilters = [];
                }
            
                oBinding.filter(this._aStatusFilters);
            }
        });
    });