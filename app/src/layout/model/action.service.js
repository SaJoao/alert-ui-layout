(function () {
    "use strict";
    

    /** 
    Action
    Screen actions, not to be confused with the application actions.
    Always corresponds to load an area and, optionally, specify which button to activated in that area.
    */

    angular.module('layout')
    .service('ButtonService', ButtonService);
    
    
    //ButtonService.$inject = ['Path'];
    //function ButtonService(Path) {
    function ButtonService() {    
        var service = this;

        service.constructor = function(areaFqn, button) {

            if(!validateParams()) {
              throw 'Invalid parameters.';
            }
            this.areaFqn = areaFqn;
            this.button = button;
        }
      
        service.validateParams = function() {
            /*
            1. areaFqn is the full qualified name of an area (area's ids from the top level area, joined by ".")
            2. button is of type string. It is optional. If provided should correspond to a valid button id in the provided area.
            */
            return  true;
        }
    
        return service.constructor;
    }
    
})();
    