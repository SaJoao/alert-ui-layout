(function () {
    "use strict";
    
    /** 
    Area
    Screen area. Includes an id, its position in the screen, a list of buttons, a list of child areas,
    and optionally a component to load
    */
    angular.module('layout')
    .service('Area', Area);
    
    
    Area.$inject = ['Path'];
    function Area(Path) {
        var service = this;

        service.constructor = function(id, description, pos) {

            if(!service._validateParams()) {
                throw 'Invalid parameters.';
            }
            service.id = id;
            service.description = description;
            service.pos = pos;
            // Buttons map
            service.buttons = {};
            // Array of button ids to keep track of the buttons' position in the area
            service.buttonsPos = [];
            // Child areas map
            service.areas = {};
        }      


        service.setButtons = function(buttons, buttonsPos) {

            for (var i = 0; i < buttonsPos.len; i++) {

                service.addButton(buttons[buttonsPos[i]], i);
            }
        }

        service.addButton = function(button, pos) {
            if(pos) { 
                service.buttonsPos.splice(pos, 0, button.id); 
            } else {
                service.buttonsPos.push(button.id);
            }

            service.buttons[button.id] = button;
        }
        
        service.delButton = function(button) {
            // TODO: IMPLEMENT
        } 

        /**
         * Add object area to the area specified by parentPath. 
         * If the parentPath is not provided then add it to this area.
         * Returns the path of the added area or null if the provided parentPath does not exist.
         * 
         * Note that the parentPath is relative to the current area (See findArea method description).
         */
        service.addArea = function(area, parentPath) {

            if(!area) {
                return null;
            }

            if(!parentPath || !parentPath.getId()) {
                // If parent is not provided then add to current  
                service.areas[area.id] = area;
            } else {

                let parentArea = service.findArea(parentPath);
                if(parentArea) {

                    parentArea.addArea(area);
                    let path = new Path(parentPath.toString());
                    path.append(area.id)
                    return path;

                } else {
                    console.log('addArea: path does not exist, returning...');
                    return null;
                }
            }
        }

        service.delArea = function(area) {
            // TODO: IMPLEMENT
        } 

   
        /**
         * The path to an area is a '.' separated string of the ids of the area ancestors in the areas'
         * tree.
         * 
         * This method expect a path relative to the position of this area in the tree. I.e., the first
         * id on the path must match one of the child areas of this area.
         */    
        service.findArea = function(path) {

            // Clone path object before calling _findAreaRec because it is changed in 
            return service._findAreaRec(new Path(path.toString()));
    
        }

        service._findAreaRec = function(path) {
            for (var key in service.areas) {
                if (service.areas.hasOwnProperty(key)) {

                    let childArea = service.areas[key];
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

            // List of areas ended without a match: Not Found.
            return null;
        }


        service._validateParams = function() {
            /*
            1. id is of type String and is mandatory
            2. description is of type String and is mandatory
            3. pos is of type int and correspond to a fixed position in the screen
            4. elements of 'buttons' array are of type 'Button'
            5. elements of 'areas' array are of type 'Area'
            6. component is of type string and identifies the element (swf or crate) to load 
            */
            return  true;
        }
        

        return service.constructor;
    }
    
   
    
})();
    