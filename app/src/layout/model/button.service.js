(function () {
    "use strict";
    
    /**
    Button
    Button attributes and the screen action it executes when called
    */

    angular.module('layout')
    .service('Button', Button);
    
    
    //ButtonService.$inject = ['Path'];
    //function ButtonService(Path) {
    function Button() {    
        var service = this;

        service.constructor = function(id, label, icon, action) {

            if(!service.validateParams()) {
              throw 'Invalid parameters.';
            }
            service.id = id;
            service.label = label;
            service.icon = icon;
            service.action = action;
            
        }
      
        service.setAction = function(action) {

            //TODO: Implement
            return service;
        }


        service.validateParams = function() {
            /*
            1. id is of type String and is mandatory
            2. label is the code of the button description text
            3. icon is the code of the button's Icon
            4. action is of type 'Action'
            */
            return true;
        }
    
        return service.constructor;
    }
    
})();
    