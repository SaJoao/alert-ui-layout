(function () {
"use strict";

angular.module('layout')
.controller('LayoutController', LayoutController);


LayoutController.$inject = ['LayoutService', 'Path', 'Area', 'Button', 'Action'];
function LayoutController(LayoutService, Path, Area, Button, Action) {
    var service = this;

    service.topArea = {};

    LayoutService.getLayout().then(function(layout){


        service.topArea = new Area(layout.id, layout.description, layout.pos);

        service.topArea.setAreas(service.getAreas(layout.areas));


        });
        
    

    service.getAreas = function(areasJson) {

        if(!areasJson) 
            return;

        var areas = {}
        for (var key in areasJson) {
            if (areasJson.hasOwnProperty(key)) {
                
                areas[key] = service.getArea(areasJson[key]);
        
            }
        }
        return areas;
    }

    service.getArea = function(areaJson) {

        var area = new Area(areaJson.id, areaJson.description, areaJson.pos);

        area.areas = service.getAreas(areaJson.areas);

        area.setButtons(service.getButtons(areaJson.buttons));

        return area;
    }



    service.getButtons = function(buttonsJson) {

        if(!buttonsJson) 
            return;

        var buttons = {}
        for (var key in buttonsJson) {
            if (buttonsJson.hasOwnProperty(key)) {
                
                buttons[key] = service.getButton(buttonsJson[key]);
            }
        }
        return buttons;
    }


    service.getButton = function(buttonJson) {

        var button = new Button(buttonJson.id, buttonJson.label, buttonJson.icon);

        button.setAction(service.getAction(buttonJson.action));

        return button;
    }    

    service.getAction = function(actionJson) {

        var action = new Action();

        return action;
    }


    return service.constructor;
}



})();
