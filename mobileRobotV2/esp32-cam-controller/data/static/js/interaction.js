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
// loading message
var loadingMsg = document.getElementById('loading-container');
// full screen 
var fullScreenStatus = document.getElementById('fs-status');
var fullScreenIcon = document.getElementById('fs-icon');
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

// pinch zoom gesture variables
// code partially based on :
// github.com/mdn/dom-examples/blob/main/pointerevents/Pinch_zoom_gestures.html
// 
// Global variables to cache event state
var evCache = new Array();
var prevDiff = -1;
//----------------------------------------------------------------------

/**
 * Event listener
 * ---------------------------------------------------------------------
 */

// start stop stream with button
document.addEventListener('DOMContentLoaded',()=>{
  // show initial message over stream area
  loadingMsg.hidden = false;
  // set camera initial values
  //cameraInitialValues();
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
            console.log(el.querySelector('.status-control').innerHTML);
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
                //console.log("increase");
                ev.target.style.width = "100%";
                ev.target.style.height = "100%";
                ev.target.style.objectFit = "cover"; 
            }
            if (curDiff < prevDiff) {
                // The distance between the two pointers has decreased
                //console.log("decrease");
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

    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(0%) sepia(0%) saturate(18%) hue-rotate(293deg) brightness(102%) contrast(105%)'; 
    })
    menuContainer.style.color = 'black';
    //console.log("normal landscape");
}
function normalPortrait(){
    streamContainer.style.width = 'calc(100vw - 80px)';
    streamContainer.style.height = 'calc(0.70*(100vw - 80px))';
    streamContainer.style.top = '4em';
    
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.objectFit = 'cover';

    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(0%) sepia(0%) saturate(18%) hue-rotate(293deg) brightness(102%) contrast(105%)'; 
    })
    menuContainer.style.color = 'black';
    //console.log("normal portrait");
}
function fullLandscape(){
    streamContainer.style.width = '100vw';
    streamContainer.style.height = '100vh';
    streamContainer.style.top = '0em';
    
    view.style.height = '100vh';
    view.style.width = 'auto';
    
    document.querySelectorAll('.color-control').forEach((el)=>{
        el.style.filter = 'invert(100%) sepia(3%) saturate(549%) hue-rotate(219deg) brightness(119%) contrast(100%)'; 
    })
    menuContainer.style.color = 'white';
    //console.log("full landscape");
}
function fullPortrait(){
    streamContainer.style.width = '100vw';
    streamContainer.style.height = '100vh';
    streamContainer.style.top = '0em';
    
    view.style.width = '100vw';
    view.style.height = 'auto';
    
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
//----------------------------------------------------------------------