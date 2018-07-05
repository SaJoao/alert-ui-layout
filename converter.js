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

/**
 * Map screen areas with new model area ids
 */
pathMap = { '1': '3', '2': '10', '3': '5.1', '4': '5.2', '6': '1', '7': '12', '8': '4', '10': '11.1', '11': '11.2' }

/**
 * Properties by area
 */
areaMap = { 
    '1': {'msg': 'Personal settings area', 'pos': 6 },
    '3': {'msg': 'Logout button area', 'pos': 1 },
    '4': {'msg': 'Alerts area', 'pos': 8 },     
    '5': {'msg': 'Top menu', 'pos': 3 }, 
  '5.1': {'msg': 'Top menu left', 'pos': 3 },
  '5.2': {'msg': 'Top menu right', 'pos': 4 },
    '10': {'msg': 'Back button area', 'pos': 2 },            
    '11': {'msg': 'Bottom menu', 'pos': 10 },
  '11.1': {'msg': 'Bottom menu left', 'pos': 10 },
  '11.2': {'msg': 'Bottom menu left', 'pos': 11 },
    '12': {'msg': 'Ok area', 'pos': 7 }            
}

/*
Area
Screen area. Includes an id, its position in the screen, a list of buttons, a list of child areas,
and optionally a component to load
*/
class Area {
    constructor(id, description, pos) {

        if(!this._validateParams()) {
            throw 'Invalid parameters.';
        }
        this.id = id;
        this.description = description;
        this.pos = pos;
        // Buttons map
        this.buttons = {};
        // Array of button ids to keep track of the buttons' position in the area
        this.buttonsPos = [];
        // Child areas map
        this.areas = {};
        this.component = '';
    }





    addButton(button, pos) {
        if(pos) { 
            this.buttonsPos.splice(pos, 0, button.id); 
        } else {
            this.buttonsPos.push(button.id);
        }

        this.buttons[button.id] = button;
    }

    delButton(button) {
        // TODO: IMPLEMENT
    } 

   /**
     * Add object area to the area specified by path. 
     * If the path is not provided then add it to this areas.
     * Returns the path of the added area or null if the provided path does not exist.
     * 
     * Note that the path is relative to the current area (See findArea method description).
     */
    addArea(area, path) {

        if(!area) {
            return null;
        }

        if(!path) {
            // If parent is not provided then add to current  
            console.log('adding area to topArea: ', area);
            this.areas[area.id] = area;
        } else {

            let parentArea = this.findArea(path);
            if(parentArea) {
                parentArea.addArea(area);
                return path + "." + area.id;

            } else {
                console.log('addArea: path does not exist, returning...');
                return null;
            }
        }
    }

    delArea(area) {
        // TODO: IMPLEMENT
    } 

    setComponent(component) {
        this.component = component;
    }  

   
   /**
     * The path to an area is a '.' separated string of the ids of the area ancestors in the areas'
     * tree.
     * 
     * This method expect a path relative to the position of this area in the tree. I.e., the first
     * id on the path must match one of the child areas of this area.
     */    
    findArea(path) {

        return this._findAreaRec(this, path.split('.'));
    
    }

    _findAreaRec(area, pathArr) {

            for (var key in area.areas) {
                if (area.areas.hasOwnProperty(key)) {

                    let childArea = area.areas[key];
                    
                    if(pathArr[0] === childArea.id) {
                        
                        if(pathArr.length === 1) {
                            // Id matches at last level: Found!
                            return area;
                        } else {
                            // Proceed with search at next level removing the first position of the array
                            pathArr.shift()
                            console.log('childArea.id    : ', childArea.id);
                            console.log('pathArr         : ', pathArr);
                            return this._findAreaRec(childArea, pathArr);
                        }
                    }
                }
            }

        // List of areas ended without a match: Not Found.
        return null;
    }


    _validateParams() {
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
    constructor(id, label, icon, action) {

        if(!this.validateParams()) {
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
    constructor(areaFqn, button) {

        if(!validateParams) {
          throw 'Invalid parameters.';
        }
        this.areaFqn = areaFqn;
        this.button = button;
    }
  
    validateParams() {
        /*
        1. areaFqn is the full qualified name of an area (area's ids from the top level area, joined by ".")
        2. button is of type string. It is optional. If provided should correspond to a valid button id in the provided area.
        */
        return  true;
    }
}



/** */
processLine = function(line) {

    lineArr = line.split('\t');

   
    processArea(lineArr);
    processButton(lineArr);

}

/** */
processArea = function(lineArr) {

    areaPath = pathMap[lineArr[6]];

    console.log('areaPath', areaPath);

    pathArr = areaPath.split('.');
    subPathArr = [];
    subPath = '';
    parentPath = '';
    
    pathArr.forEach(function(e){
        
        subPathArr.push(e);
        console.log('subPathArr: ', subPathArr);
        subPath = subPathArr.join('.');
        console.log('subPath: ', subPath);

        if(!topArea.findArea(subPath)) {
            console.log('Area ' + subPath + ' not found in top area. Creating...');
            console.log('parentPath' ,parentPath);
            let area = getArea(subPath);
            topArea.addArea(area, parentPath);

            if(parentPath) {
                parentPath = parentPath + '.' + area.id;
            } else {
                parentPath = subPath;
            }

        } 

    });


    // Create area if it does not exists yet
    
}


/**
 * Get area
 */
getArea = function(path) {

    // The area id is the last segment of the path
    let areaId = path.split('.').slice(-1)[0];
    return new Area(areaId, areaMap[path].msg, areaMap[path].pos);
}




/** */
processButton = function(lineArr) {

    button = getButton(lineArr);

    areaPath = pathMap[lineArr[6]];

    console.log('searching area: ', areaPath);
    area = topArea.findArea(areaPath);
    console.log('area: ', area);
    area.addButton(button);
}

camelize = function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

getButton = function(lineArr) {

    // TODO: Based on the exitance of icon: Review!
    let icon = lineArr[4];
    if(icon) {
        button = new Button(camelize(icon), lineArr[11], icon);
    }
    return button;
}




// Input file 
let file = process.argv[2];
let topAreaId = '0';
let topAreaDesc = 'Default layout for EDIS';

// Create top level area 
let topArea = new Area(topAreaId, topAreaDesc, '0');

// Read file lines
var lineReader = readline.createInterface({
    input: fs.createReadStream(file)
  });

lineReader.on('line', function (line) {
    processLine(line);
});  

lineReader.on('close', function(){
    console.log(JSON.stringify(topArea));
});

