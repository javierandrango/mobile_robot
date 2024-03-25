/**
 * Variable declaration
 * ---------------------------------------------------------------------
 */
//HTML
let toggle = document.getElementById("toggleButton");
let esp32LedStatus = document.getElementById("ESP32Led");
//web socket URL
var websocket;
let gateway = `ws://${window.location.hostname}/ws`;
//----------------------------------------------------------------------


/**
 * Event listener
 * ---------------------------------------------------------------------
 */

if (toggle){
    let ledState = "";
    toggle.addEventListener("click",()=>{
        if (toggle.classList.contains("btn-secondary")){
            //toggle button color
            toggle.classList.remove("btn-secondary");
            toggle.classList.add("btn-success");
            //change led status name
            toggle.innerHTML = "LED ON"
            //esp32LedStatus.value = "ON"
            ledState = "ON"
        }
        else{
            toggle.classList.remove("btn-success");
            toggle.classList.add("btn-secondary");
            toggle.innerHTML = "LED OFF"
            //esp32LedStatus.value = "OFF"
            ledState = "OFF"
        }
        sendData(ledState);
    })
}


window.addEventListener("load",()=>{
    createWebSocket();
});
//----------------------------------------------------------------------


/**
 * User functions
 * ---------------------------------------------------------------------
 */


function createWebSocket(){
    console.log("Trying to open a WebSocket connection...");
    //create webSocket
    websocket = new WebSocket(gateway);
    
    //connection openned
    websocket.addEventListener("open",(event)=>{
        console.log("webSocket connection openned");
    });

    //listen for errors
    websocket.addEventListener("error",(event)=>{
        if(event){
            console.log("webSocket error")
        }
    });

    //attemp to reconnect after a short time
    websocket.addEventListener("close",(event)=>{
        console.log("webSocket connection closed");
        setTimeout(createWebSocket,2000);    
    });
}


function sendData(data){
    //check if the webSocket is on OPEN state (state 1 is OPEN)
    //more info: developer.mozilla.org
    if(websocket.readyState === WebSocket.OPEN){
        websocket.send(data);
    }
    else{
        console.log("WebSocket connection is not open");
    }
}


//----------------------------------------------------------------------
