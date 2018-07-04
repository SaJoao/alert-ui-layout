fs = require('fs');
readline = require('readline');


/*
Layout
Includes the id, the description and the layout's top level area
*/

/*
class Layout {
    constructor(id, description, area) {

        if(!validateParams) {
            throw 'Invalid parameters.';
        }
        this.id = id;
        this.description = description;
        this.area = area;
    }

    validateParams() {
        return  true;
    }
}
*/


/*
Area
Screen area. Includes an id, its position in the screen, a list of buttons, a list of child areas,
and optionally a component to load
*/
class Area {
    constructor(id, description, pos, buttons, areas, component) {

        if(!validateParams) {
            throw 'Invalid parameters.';
        }
        this.id = id;
        this.description = description;
        this.pos = pos;
        this.buttons = buttons;
        this.areas = areas;
        this.component = component;
    }

    setButtons(buttons) {
        this.buttons = buttons;
    }

    addButton(button, pos) {
        if(pos) { 
            buttons.splice(pos, 0, button); 
        } else {
            buttons.push(button);
        }
    }

    setAreas(areas) {
        this.areas = areas;
    }

    addArea(area) {
        this.area.push(area);
    }



    getArea = function(areaId) {
        areaIdArr = areaId.split('.');
    
        findArea(topArea, areaIdArr);
    
    }
    
    getDescendantArea = function(areaId) {
        
        // The area Id must be conjunction of the ids from the top area joined by '.'
        // I.e., the id of area 'x', child of area 'y', is 'y.x'
        return findDescendantArea(this, areaId.split('.'));
    
    }

    findDescendantArea = function(area, areaIdArr) {
    
        if(area.id === areaIdArr[0] ) {
            if(areaIdArr.length() === 1) {
                // Id matchs at last level: Found!
                return area;
            } else {
                if( area.getAreas() ) {
                    for(childArea in area.getAreas() ) {
                        // Proceed with search at next level removing the first position of the array
                        return findArea(childArea, areaIdArr.shift());
                    }
                } else {
                    // No more child areas: Not found
                    return null;
                }
            }
        } else {
            // Ids do not match at current level: Not found
            return null;
        }
     
    }
    
    
    setDescendantArea = function(areaId) {
        
        // The area Id must be conjunction of the ids from the top area joined by '.'
        // I.e., the id of area 'x', child of area 'y', is 'y.x'
        return findDescendantArea(this, areaId.split('.'));
    
    }    
   

    setComponent(component) {
        this.component = component;
    }    

    validateParams() {
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
}


/*
Button
Button attributes and the screen action it executes when called
*/
class Button {
    constructor(id, label, icon, component) {

        if(!validateParams) {
          throw 'Invalid parameters.';
        }
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.action = action;
    }
  
    validateParams() {
        /*
        1. id is of type String and is mandatory
        2. label is the code of the button description text
        3. icon is the code of the button's Icon
        4. action is of type 'Action'
        */
        return  true;
    }
}

/*
Action
Screen actions, not to be confused with the application actions.
Always corresponds to load an area and, optionally, specify which button to activated in that area.
*/
class Action {
    constructor(area, button) {

        if(!validateParams) {
          throw 'Invalid parameters.';
        }
        this.area = area;
        this.button = button;
    }
  
    validateParams() {
        /*
        1. elements of 'area' are full qualified name of an area (area id separated by .)
        2. button is of type string. It is optional. If provided should correspond to a valid button id in the provided area.
        */
        return  true;
    }
}

// Input file 
let file = process.argv[2];
let topAreaId = '0';
let topAreaDesc = 'Default layout for EDIS';

//constructor(id, description, pos, buttons, areas, component) 
let topArea = new Area(topAreaId, topAreaDesc, '0');

var lineReader = readline.createInterface({
    input: fs.createReadStream(file)
  });


lineReader.on('line', function (line) {
    processLine(line.split('\t'));
});  


processLine = function(fields) {

    console.log('fields[0]:', fields[0]);
    let areaId = getAreaPosition(fields);

    area = topArea.getDescendantArea(areaId);

    if(!area) {
        // Area not found. Going to create it.
        topArea.setDescendantArea(area);
    } 
}





getAreaPosition = function(fields) {

     return(fields[6]);
}


/**
 * Convert area id from old to new model
 */
getAreaId = function(fields) {

    switch(fields[6]){
        case '1':
        return '0.3';
        case '2':
        return '0.10';
        case '3':
        return '0.5.1';
        case '4':
        return '0.5.2';
        case '6':
        return '0.1';
        case '7':
        return '0.12';
        case '8':
        return '0.4';
        case '9':
        return '0.6';
        case '10':
        return '0.11.1';
        case '11':
        return '0.11.2';
    }
}


