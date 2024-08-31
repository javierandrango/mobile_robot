/**
 * Variable declaration
 * ---------------------------------------------------------------------
 */
// image variables from html
const mainContainer = document.getElementById('main-container');
const view = document.getElementById('stream');
const streamContainer = document.getElementById('stream-container');
// navigation bar
const streamStatus = document.getElementById('stream-status');
const btnStream = document.getElementById('btn-stream');
const btnFullScreen = document.getElementById('btn-screen');
const btnFullScreenContainer = document.getElementById('fs-button-container');
const btnMenu = document.getElementById('btn-menu');
const btnClose = document.getElementById('btn-close');
const btnXclk = document.getElementById('set-xclk');
const btnControl = document.getElementById('btn-control');
const controlStatus = document.getElementById('control-status');
const btnCamera = document.getElementById('btn-camera');
// loading message
let loadingMsg = document.getElementById('loading-container');
// full screen 
let fullScreenStatus = document.getElementById('fs-status');
let fullScreenIcon = document.getElementById('fs-icon');
// menu options
const xclkValue = document.getElementById('xclk-value');
const menuContainer = document.getElementById('menu-opt-container');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('quality-value'); 
const brightnessInput = document.getElementById('brightness');
const brightnessValue = document.getElementById('brightness-value'); 
const contrastInput = document.getElementById('contrast');
const contrastValue = document.getElementById('contrast-value');
const saturationInput = document.getElementById('saturation');
const saturationValue = document.getElementById('saturation-value');
const ledIntensity = document.getElementById('led_intensity');
const ledValue = document.getElementById('led-value');
//controller 
const controllerContainer = document.getElementById('controller-container');
const btnPrevious = document.getElementById('carousel-previous');
const btnNext = document.getElementById('carousel-next');
const carousel = document.querySelector('.carousel');
const carouselItem = document.querySelector('.carousel-item');
const controllerButtons = document.querySelectorAll('.c-buttons');
const buttonsData = document.getElementById('buttons-data');
const joystickData = document.getElementById('joystick-data');
// controller buttons
// Object to store intervals for each button
let buttonsInterval = {};
// time interval(to update the controller array) in ms, 
const timeInterval = 50;
// to detect a single/long touch action
let touchStartTime;
let longTouchTimeout;
const longTouchThreshold = 300;
// controller joystick
let canvas = document.querySelector('#canvas-joystick');
// joystick canvas dimension
let el = window.getComputedStyle(canvas);
let canvasWidth = parseInt(el.width);
let canvasHeight = parseInt(el.height);
// canvas dimension
let ctx = canvas.getContext('2d');
// using scale helps to improve the image quality
const scale = window.devicePixelRatio || 1;
ctx.canvas.width = canvasWidth*scale;
ctx.canvas.height = canvasHeight*scale;
ctx.scale(scale,scale);
//joystick draw dimensions
let joystickRadius = 0.7*canvasWidth/2;
let pointerRadius = 0.25*canvasWidth/2;
let centerX = canvasWidth/2;
let centerY = canvasHeight/2;
let movePointer = false;

// controller data 
let controllerArray = ['0','0','0','0','0','0','0','0'];
let controllerString;

// pinch zoom gesture variables
// Global variables to cache event state
let evCache = new Array();
let prevDiff = -1;
//----------------------------------------------------------------------

/**
 * Event listener
 * ---------------------------------------------------------------------
 */

// start stop stream with button
document.addEventListener('DOMContentLoaded',()=>{
    //hide control
    //controllerContainer.style.display = 'none';
    // show initial message over stream area
    loadingMsg.hidden = false;
    // set camera initial values
    //cameraInitialValues();

    // observe control buttons changes
    textContentChanges(buttonsData);

    //control initial values
    if(controlStatus.innerHTML === '0'){
        controllerContainer.style.display = 'none';
        btnControl.style.border = 'solid red 2px';
    }
    else if (controlStatus.innerHTML === '1'){
        controllerContainer.style.display = 'flex';
        btnControl.style.border = 'solid green 2px';
    }

    //joystick
    joystick(centerX,centerY,joystickRadius);
    pointer(centerX,centerY,pointerRadius);
    document.addEventListener('mousedown',(event)=>{
        startDrawing(event);
    })
    document.addEventListener('mouseup',()=>{
        stopDrawing();
    })
    document.addEventListener('mousemove',(event)=>{
        draw(event);
    })
    document.addEventListener('touchstart',(event)=>{
        startDrawing(event);
    });
    document.addEventListener('touchend',()=>{stopDrawing();});
    document.addEventListener('touchcancel',()=>{stopDrawing();});
    document.addEventListener('touchmove',(event)=>{
        draw(event);
    });

})
// adjust screen with orientation
if ('orientation' in screen){
    screen.addEventListener('change',()=>{
        screenStatus(fullScreenStatus.innerHTML);
    });
}
// return to normal mode(close full screen)
// if back button is pressed instead of full screen button
document.addEventListener('fullscreenchange',()=>{
    // exit full screen
    if(document.fullscreenElement === null){
        fullScreenIcon.src = '/data/static/icons/full-screen.svg';
        exitFullscreen();
        fullScreenStatus.innerHTML = 'normal';
        screenStatus(fullScreenStatus.innerHTML);
    }
})
// menu options
// principal buttons(stream,picture,control) status and color
document.querySelectorAll('.action-control').forEach((el)=>{
    el.addEventListener('click',()=>{
        if(el.querySelector('.status-control')){
            if(el.querySelector('.status-control').innerHTML === '0'){
                el.querySelector('.status-control').innerHTML = '1';
                el.style.border = 'solid green 2px';
            }
            else{
                el.querySelector('.status-control').innerHTML = '0';
                el.style.border = 'solid red 2px';
            }
            //console.log(el.querySelector('.status-control').innerHTML);
        }
    })
})
// start/stop stream
btnStream.addEventListener('click',()=>{
    if(streamStatus.innerHTML === '0'){
        stopStream();
        loadingMsg.hidden = false;
        btnFullScreenContainer.hidden = true;
        if(fullScreenStatus.innerHTML === 'full'){
            screenStatus(fullScreenStatus.innerHTML);
            fullScreenStatus.innerHTML = 'normal';
            fullScreenIcon.src = '/data/static/icons/full-screen.svg';
            exitFullscreen();
        }
    }
    else{
        startStream();
        loadingMsg.hidden = true;
        btnFullScreenContainer.hidden = false;
    }
})
// open/close menu options
btnMenu.addEventListener('click',()=>{
    menuContainer.hidden = false;
    menuContainer.style.zIndex = 1000;
    view.style.zIndex = 0;
    //console.log("menu opened");
})
btnClose.addEventListener('click',()=>{
    menuContainer.hidden = true;
    //console.log("menu closed")
})
// shows image quality value 
qualityInput.addEventListener("input",(event)=>{
    qualityValue.textContent = event.target.value;
})
// shows image brightness value 
brightnessInput.addEventListener("input",(event)=>{
    brightnessValue.textContent = event.target.value;
})
// shows image contrast value 
contrastInput.addEventListener("input",(event)=>{
    contrastValue.textContent = event.target.value;
})
// shows image saturation value 
saturationInput.addEventListener("input",(event)=>{
    saturationValue.textContent = event.target.value;
})
// shows led intensity value
ledIntensity.addEventListener("input",(event)=>{
    ledValue.textContent = event.target.value;
})
// change image configuration on tag change
document.querySelectorAll('.default-action').forEach((el)=>{
    el.addEventListener('change',()=>{
        updateConfig(el);
    })
})
// change xclk on button click
btnXclk.addEventListener('click',()=>{
    let xclkValue = document.getElementById('xclk-value').value;
    setXclkValue(xclkValue);
})

// enter/exit full screen mode
btnFullScreen.addEventListener('click',()=>{
    if(fullScreenStatus.innerHTML === 'normal'){
        fullScreenStatus.innerHTML = 'full';
        fullScreenIcon.src = '/data/static/icons/exit-full-screen.svg';
        screenStatus(fullScreenStatus.innerHTML);
        requestFullscreen(mainContainer);
    } 
    else if(fullScreenStatus.innerHTML === 'full'){
        fullScreenStatus.innerHTML = 'normal';
        fullScreenIcon.src = '/data/static/icons/full-screen.svg';
        screenStatus(fullScreenStatus.innerHTML);
        exitFullscreen();
    }
})

// controller
// carousel control
btnPrevious.addEventListener('click',()=>{
    carousel.scrollBy({ left: -carouselItem.offsetWidth, behavior: "smooth" });
    btnPrevious.style.color = 'rgba(128,128,128, 0.2)';
    btnNext.style.color = 'black';
})
btnNext.addEventListener('click',()=>{
    carousel.scrollBy({ left: carouselItem.offsetWidth, behavior: "smooth" });
    btnPrevious.style.color = 'black';
    btnNext.style.color = 'rgba(128,128,128, 0.2)';
})
// show/hide control
btnControl.addEventListener('click',()=>{
    if(controlStatus.innerHTML === '0'){
        controllerContainer.style.display = 'none';
    }
    else if (controlStatus.innerHTML === '1'){
        controllerContainer.style.display = 'flex';
    }
})
/*
// buttons control with click event
controllerButtons.forEach(el=>{
    el.addEventListener('click',()=>{
        buttonsData.innerHTML = el.value;
        console.log(el.value);
    })
})
*/

// buttons control with touch event
controllerButtons.forEach(el=>{
    // the unique identifier for every button
    const buttonId = el.id;
    el.addEventListener('touchstart',(event)=>{
        event.preventDefault();
        // time interval must set for each button
        // uptade interval every 50ms
        buttonsInterval[buttonId] = setInterval(()=>{
            controllerArray[7] = el.value;
            controllerString = controllerArray.join("");
            buttonsData.innerHTML = el.value;
            console.log(controllerString);
        },timeInterval);

    })
    el.addEventListener('touchend',()=>{
        // clear interval for a specific button
        clearInterval(buttonsInterval[buttonId]);
        // remove the reference for the interval object
        delete buttonsInterval[buttonId];
        //
        controllerArray[7] = '0';
        controllerString = controllerArray.join("");
        //
        console.log(controllerString);
    })
    el.addEventListener('touchcancel',()=>{
        clearInterval(buttonsInterval[buttonId]);
        delete buttonsInterval[buttonId];
        controllerArray[7] = '0';
        controllerString = controllerArray.join("");
        
        console.log(controllerString);
    })
})
//----------------------------------------------------------------------

/**
 * User functions
 * ---------------------------------------------------------------------
 */
// pinch zoom gesture
// code partially based on :
// github.com/mdn/dom-examples/blob/main/pointerevents/Pinch_zoom_gestures.html
//
function pointerdownHandler(ev) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    evCache.push(ev);
}
function pointermoveHandler(ev) {
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the taget element (image) fit into the screen and if the
    // distance is decreasing (zoom out), the target element (image) return to
    // its original size
    //
    // Find this event in the cache and update its record with this event
    for (var i = 0; i < evCache.length; i++) {
        if (ev.pointerId == evCache[i].pointerId) {
            evCache[i] = ev;
            break;
        }
    }
    // If two pointers are down, check for pinch gestures
    if (evCache.length == 2) {
        // Calculate the distance between the two pointers
        var curDiff = Math.sqrt(
            Math.pow(evCache[1].clientX - evCache[0].clientX, 2) + 
            Math.pow(evCache[1].clientY - evCache[0].clientY, 2)
        );
        if (prevDiff > 0) {
            if (curDiff > prevDiff) {
                // The distance between the two pointers has increased
                console.log("increase");
                ev.target.style.width = "100%";
                ev.target.style.height = "100%";
                ev.target.style.objectFit = "cover"; 
            }
            if (curDiff < prevDiff) {
                // The distance between the two pointers has decreased
                console.log("decrease");
                ev.target.style.objectFit = "initial";
                if ('orientation' in screen && screen.orientation.type === 'portrait-primary'){
                    ev.target.style.width = "100%";
                    ev.target.style.height = "auto";  
                }
                else{
                    ev.target.style.width = "auto";
                    ev.target.style.height = "100%";
                }
            }
        }
        // Cache the distance for the next move event
        prevDiff = curDiff;
    }
}
function pointerupHandler(ev) {
    // Remove this pointer from the cache and reset the target's
    removeEvent(ev);
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) prevDiff = -1;
}
function removeEvent(ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId == ev.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}
const setupFullScreenEventListeners = (add) => {
    const action = add ? 'addEventListener' : 'removeEventListener';
    view[action]("pointerdown", pointerdownHandler);
    view[action]("pointermove", pointermoveHandler);
    view[action]("pointerup", pointerupHandler);
    view[action]("pointercancel", pointerupHandler);
    view[action]("pointerout", pointerupHandler);
    view[action]("pointerleave", pointerupHandler);
};

// full screen mode 
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            //console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen().catch(err => {
            //console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        element.webkitRequestFullscreen().catch(err => {
            //console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen().catch(err => {
            //console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    }
}
//exit full screen mode
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
            //console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen().catch(err => {
            //console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
      });
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen().catch(err => {
            //console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
      });
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen().catch(err => {
            //console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
      });
    }
}

// simple stream function
function startStream(){
    // start stream 
    var streamUrl = document.location.origin;
    view.hidden = false;
    view.src = `${streamUrl}/stream`
    // upload an image to the data folder to use instead of the stream for debugging purposes 
    //view.src = "./test.jpg";  
}

// stop stream
function stopStream(){
    // stop stream 
    window.stop();
    view.hidden = true;
    view.src="";
}

// landscape/portrait image container
function normalLandscape(){
    /*
    var landscapeMin = window.matchMedia('only screen and (max-height:430px) and (orientation:landscape)');
    var lanscaspeMid = window.matchMedia('only screen and (min-height:431px) and (max-height:800px) and (orientation:landscape)');
    var landscapeMax = window.matchMedia('only screen and (min-height:801px)');
    
    streamContainer.style.top = '4em';
    streamContainer.style.width = 'calc(100vh - 50px)';
    streamContainer.style.height = 'calc(0.70*(100vh - 50px))';

    if (landscapeMin.matches){
        streamContainer.style.width = 'calc(100vh - 50px)';
        streamContainer.style.height = 'calc(0.70*(100vh - 50px))';
    }
    else if(lanscaspeMid.matches){
        streamContainer.style.width = 'calc(100vh - 82px)';
        streamContainer.style.height = 'calc(0.70*(100vh - 82px))';
    }
    else if(landscapeMax.matches){
        streamContainer.style.width = 'calc(100vh - 94px)';
        streamContainer.style.height = 'calc(0.70*(100vh - 94px))';
    }
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.objectFit = 'cover';
    */
    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(0%) sepia(0%) saturate(18%) hue-rotate(293deg) brightness(102%) contrast(105%)'; 
    })
    menuContainer.style.color = 'black';
    //console.log("normal landscape");
}
function normalPortrait(){
    /*
    streamContainer.style.width = 'calc(100vw - 80px)';
    streamContainer.style.height = 'calc(0.70*(100vw - 80px))';
    streamContainer.style.top = '4em';
    
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.objectFit = 'cover';
    */

    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(0%) sepia(0%) saturate(18%) hue-rotate(293deg) brightness(102%) contrast(105%)'; 
    })
    menuContainer.style.color = 'black';
    //console.log("normal portrait");
}
function fullLandscape(){
    /*
    streamContainer.style.width = '100vw';
    streamContainer.style.height = '100vh';
    streamContainer.style.top = '0em';
    
    view.style.height = '100vh';
    view.style.width = 'auto';
    */
    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(100%) sepia(3%) saturate(549%) hue-rotate(219deg) brightness(119%) contrast(100%)'; 
    })
    menuContainer.style.color = 'white';
    //console.log("full landscape");
}
function fullPortrait(){
    /*
    streamContainer.style.width = '100vw';
    streamContainer.style.height = '100vh';
    streamContainer.style.top = '0em';
    
    view.style.width = '100vw';
    view.style.height = 'auto';
    */
    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(100%) sepia(3%) saturate(549%) hue-rotate(219deg) brightness(119%) contrast(100%)'; 
    })
    menuContainer.style.color = 'white';
    //console.log("full portrait");
}

// control actions on screen rotation 
function screenStatus(status){
    if (status === 'full'){
        setupFullScreenEventListeners(true);
        if(screen.orientation.type.startsWith('landscape')){
            fullLandscape();
        }
        else if(screen.orientation.type.startsWith('portrait')){
            fullPortrait();
        }
    }
    else if (status === 'normal'){
        setupFullScreenEventListeners(false);
        if(screen.orientation.type.startsWith('landscape')){
            normalLandscape();
        }
        else if(screen.orientation.type.startsWith('portrait')){
            normalPortrait();
        }
    }
}

// change image values
function updateConfig(el){
    let value;
    switch(el.type){
        case 'checkbox':
            value = el.checked ? 1 : 0;
            break;
        case 'range':
        case 'select-one':
            value = el.value;
            break;
        case 'button':
        case 'submit':
            value = '1';
            break;
        default:
            return;
    }
    const baseHost = document.location.origin;
    const query = `${baseHost}/control?var=${el.id}&val=${value}`;
    fetch(query)
        .then(response=>{
            //console.log(`request to ${query} finished, status: ${response.status}`)
        })
}

// update menu values in html
function updateValue(el,value,updateRemote){
    updateRemote = updateRemote == null ? true : updateRemote;
    let initialValue;

    if(el.type === 'checkbox'){
        initialValue = el.checked;
        // make sure to explicity convet to a boolean
        value = !!value;
        el.checked = value;
    }
    else{
        initialValue = el.value
        el.value = value
    }
    if(updateRemote && initialValue !== value){
        updateConfig(el);
    }
}

// get camera initial values
function cameraInitialValues(){
    const baseHost = document.location.origin;
    fetch(`${baseHost}/status`)
    .then(response=>{
        return response.json();
    })
    .then(state=>{
        //console.log(state);
        document.querySelectorAll('.default-action').forEach(el=>{
            // update states of buttons, sliders and check buttons 
            updateValue(el,state[el.id],false);
            //update html values
            brightnessValue.textContent = brightnessInput.value;
            ledValue.textContent = ledIntensity.value;
            saturationValue.textContent = saturationInput.value;
            contrastValue.textContent = contrastInput.value;
            qualityValue.textContent = qualityInput.value;
        })
    })
}

// change external clock values
function setXclkValue(value){
    const baseHost = document.location.origin;
    const query = `${baseHost}/xclk?xclk=${value}`;
    fetch(query)
    .then(response =>{
        if (response.status !== 200){
            //console.log("Error["+response.status+"]:"+response.statusText);
        }
        else{
            //console.log(`request to ${query} finished, status: ${response.status}`)
            return response.text();
        }
    })
    .then(data=>{
        //console.log(data);
    })
    .catch(error=>{
        //console.log("Error[-1]:"+error);
    })
}

// observe innerHTML changes from a specific element
function textContentChanges(element){
    let observerTime = 500;
    const observeConfig = {characterData: true,childList: true,subtree: true};
    // buttons control with touch event
    controllerButtons.forEach(el=>{
        const buttonId = el.id;
        el.addEventListener('touchstart',()=>{
            touchStartTime = Date.now();
            //long touch detected
            longTouchTimeout = setTimeout(()=>{
                //console.log("long touch detected")
                observerTime = 50;
            },longTouchThreshold);
        });
        el.addEventListener('touchend',()=>{
            const touchDuration = Date.now() - touchStartTime;
            clearTimeout(longTouchTimeout);
            observerTime = 500;
            //single touch detected
            if (touchDuration < longTouchThreshold) {
                //console.log("single touch detected");
            }
        });
        el.addEventListener('touchcancel',()=>{
            clearTimeout(longTouchTimeout);
            observerTime = 500;
        });
    })
    // observer callback
    const observerCallback = function(mutationsList){
        observer.disconnect();
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                //console.log('Inner HTML or text content changed:', mutation.target.innerHTML );
                setTimeout(()=>{
                    mutation.target.innerHTML = ' ';
                    observer.observe(element, observeConfig);
                },observerTime)
            }
        }
    };
    // observer action
    const observer = new MutationObserver(observerCallback);
    observer.observe(element, observeConfig);
}

// joystick
function joystick(x,y,radius){
    /**
     * x(float): x coordinate
     * y(float): y coordinate
     * radius(float): circle radius
     */
    // joystick
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = 'rgb(30,30,30)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 8;
    ctx.stroke();
}
function pointer(x,y,radius){
    /**
     * x(float): x coordinate
     * y(float): y coordinate
     * radius(float): circle radius
     */
    // pointer
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgb(200,200,200)';
    ctx.fill();
}
function clientXY(event){
    /**
     * input
     * - event: event to handle coordinates of the viewport
     * output
     * - coord : coordinates inside the canvas
     */
    let coord = {};
    // client mouse or touch position inside the viewport
    let clientX = event.clientX || event.touches[0].clientX;
    let clientY = event.clientY || event.touches[0].clientY;
    // canvas position relative to the viewport 
    let canvasCoords = canvas.getBoundingClientRect();
    // move the origin of the coordinate sistem to the top-left corner of the canvas
    coord.x = clientX - canvasCoords.left;
    coord.y = clientY - canvasCoords.top;
    // out of boundaries
    /*
    if(coord.x < 0 || coord.y < 0){
        coord.x = -1;
        coord.y = -1;
    }
    if(coord.x > canvasWidth || coord.y > canvasHeight){
        coord.x = -1;
        coord.y = -1;
    }*/
    //console.log("coordinate x:",coord.x);
    //console.log("coordinate y:",coord.y);
    return coord;
}
function dist2points(x1,y1,x2,y2){
    /**
     * 
     */
    let d = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
    return d;
}
function startDrawing(event){
    // canvas coordinates
    let coord = clientXY(event);
    // pointer distance to the center of the joystick
    let currentRadius = dist2points(coord.x,coord.y,centerX,centerY);
    // draw the pointer inside the joystick
    if (joystickRadius >= currentRadius){
        // move the pointer only if the event(touch/click) occurs inside the joystick area
        movePointer = true;
        // update joystick
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        joystick(centerX,centerY,joystickRadius);
        pointer(coord.x,coord.y,pointerRadius);
    }
}
function stopDrawing(){
    movePointer = false;
    // update joystick
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    joystick(centerX,centerY,joystickRadius);
    pointer(centerX,centerY,pointerRadius);
    //update innerHTML value
    joystickData.innerHTML = '000000';
}
function draw(event){
    if (movePointer){
        let coord = clientXY(event);
        let currentRadius = dist2points(coord.x,coord.y,centerX,centerY);
        let angleRad = Math.atan2((coord.y - centerY),(coord.x - centerX));
        let angleDeg = 0;
        // radian to degree
        if (Math.sign(angleRad) == -1) {
            angleDeg = Math.round(-angleRad * 180 / Math.PI);
        }
        else {
            angleDeg = Math.round( 360 - angleRad * 180 / Math.PI);
        }
        // pointer radius to 0-100:
        let strength = Math.round((currentRadius*100)/joystickRadius);
        if (strength>100){strength=100;}
        
        //console.log("angle 0-360:",angleDeg);
        //console.log("strength 0-100:",strength);

        // update joystick
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        joystick(centerX,centerY,joystickRadius);
        // update pointer inside the joystick
        if (joystickRadius >= currentRadius){
            pointer(coord.x,coord.y,pointerRadius);
        }
        // update pointer outside the joystick
        else{
            let x = joystickRadius*Math.cos(angleRad) + centerX;
            let y = joystickRadius*Math.sin(angleRad) + centerY;
            pointer(x,y,pointerRadius);
        }

        //update innerHTML value
        joystickData.innerHTML = angleDeg.toString().padStart(3,'0')+strength.toString().padStart(3,'0');
        
    }
    
}

//----------------------------------------------------------------------