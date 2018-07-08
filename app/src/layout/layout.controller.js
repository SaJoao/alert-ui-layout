(function () {
"use strict";

angular.module('layout')
.service('LayoutController', LayoutController);


LayoutController.$inject = ['LayoutService','Path', 'Area','Button','Action'];
function LayoutController(LayoutService, Path, Area,Button,Action) {
    var service = this;

    service.constructor = function(){
        
        LayoutService.getLayout().then(function(layout){

            for (var key in layout) {
                if (this.layout.hasOwnProperty(key)) {

                    let childArea = this.areas[key];
                    if(path.getHead() === childArea.id) {
                        // Remove path head
                        path.removeHead();
                        if(path.toString() === '') {
                            // Id matches at last level: Found!
                            return childArea;
                        } else {
                            // Proceed with search at next level removing the first position of the array
                            return childArea.findArea(path);
                        }
                    }
                }
            }


        });
        
    };




    return service.constructor;
}



})();
