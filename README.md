# Welcome 
A brief demo of what this code actually does ... hover your mouse over the field !

<p data-height="265" data-theme-id="dark" data-slug-hash="vZbdeZ" data-default-tab="html,result" data-user="adk96r" data-embed-version="2" data-pen-title="Force Field" class="codepen">See the Pen <a href="https://codepen.io/adk96r/pen/vZbdeZ/">Force Field</a> by Adk (<a href="https://codepen.io/adk96r">@adk96r</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>



## Let's dive straight into the code!
Trust me, it's dead simple to use ! ( Just make sure you have JQuery )
#### 1. Create an # element:
This will host your force field grid. Make sure to assign it a unique ID , as it will be used later. Keep the block empty.
```html
      <div id="Grid"></div>
 ```
#### 2. Start the field:
In order to start the field, you need to an object having the **ID** of the field grid element that was created earlier. It can be created as -
```javascript
      settings = new Object({
          "fgrid" : "Grid ( your ID )"
          ...
      });
```
Now start the field by calling initGrid which takes the __settings__ object as the only argument.
```javascript
      initGrid( settings );
```
That's it. You have your own force field! But if you want to make it even more epic, __scroll down__.
## 3. Tweak the settings ( Even Better ! )
The field has a ton of settings which you can tweak! You can change the following -

#### Field Grid - 
1. __fieldHeight__ : &nbsp;Height of the grid.
2. __fieldWidth__ : &nbsp;&nbsp;Width of the grid.
3. __fgridClassArray__ : An array of strings which represent the classes to be applied to FGrid Object.
```javascript
    var settings = new Object({
        'fgrid' : 'Grid',
        ...
        'fieldHeight' : 300,
        'fieldWidth' : 300,
        'fgridClassArray' : ['classA', 'classB',   ....   , 'classC']
        ...
    }));
``` 
#### Field Dots
Each Field dot is basically -
```css
    .fdot{
        margin: 8px;
        height: 4px;
        width: 4px;
        border-radius: 2px;
        position: absolute;
        background-color: rgba(0,190,145,255);
    }
```
1. __dotMargin__ : &nbsp;The margin for the dot.
2. __size__ : &nbsp;&nbsp;The Width & Height of the dot ( both are equal ) .
3. __fdotClassArray__ : An array of strings which represent the classes to be applied to FGrid Object. ( similar to fgridClassArray.
4. __rgbaStateFalse__ : An array contaning the __rgba__ values of the dot when it is being not active ( not under the effect of field ).
5. __rgbaStateTrue__ : An array contaning the __rgba__ values of the dot when it is being active ( under the effect of field ).


```javascript
    var settings = new Object({
        'fgrid' : 'Grid',
        ...
        'dotMargin' : 6,
        'size' : 4,
        'fdotClassArray' : ['dotClassA',   ...   , 'dotClassN'],
        'rgbaStateFalse' : [255, 0, 0, 255],
        'rgbaStateTrue' : [0, 0, 255, 255],
        ...
    }));
``` 
+ __border-radius__ is generated as __size/2__ . Try to keep size an even integer as it will be halved.
+ __dotSize__ is generated as __2 * margin + size__ .

#### Field Properties
These properties control the field itself, i.e, how the dots will react upon a movement of another body ( in this case the mouse ) .
1. __forceSpread__: This will specify how many of the surrounding dots are affected ( in physical terms it is analogous to the mass of the moving body in a field ). Larger the no. wider the scope. eg- spread = 3 means 3 dots on each side will be effected.
2. __fieldEqn__: This is the equation of the field. By default it is
    $$f(dx,dy) = margin - 10 * Max(0 , 7 - 1.5*log ( dx^2 + dy^2))$$.
```javascript
    function newForceField (delta_x, delta_y) {
        // Let this be the new field equation.
        return delta_x * delta_y + margin;
    }
    
    var settings = new Object({
        'fgrid' : 'Grid',
        ...
        'forceSpread' : 15,
        'fieldEqn' : newForceField,
        ...
    }));
``` 
+ The field equation accepts exactly 2 arguments, __delta_x__ and __delta_y__ which are the x and y distances between the field dot's location and the mouse pointer's location.
    
### Voilà !
That's it. Now just run this,
```javascript
    initGrid( settings );
```
and you're good to go.

#### A brief note & default values :
The default values for the various properties mentioned above are : 
```javascript
    fgridHeight = 300;
    fgridWidth = 300;
    
    margin = 5;
    size = 4;
    rgba_state_true = [255, 150, 255, 255];
    rgba_state_false = [0, 190, 145, 255];
    
    spread = 10;
    FieldEqn = sensitivityVal;
    
    function sensitivityVal(delta_x, delta_y){
        return margin + 10*Math.max(0, 7 + Math.log(1/Math.pow(Math.hypot(delta_x,delta_y),1.5)));
    }
```
You can tweak them further to suit your tastes !
Hope you like using this code ! ✌
