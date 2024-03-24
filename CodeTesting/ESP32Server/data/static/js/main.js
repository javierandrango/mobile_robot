let toggle = document.getElementById("toggleButton");
let esp32LedStatus = document.getElementById("ESP32Led");

if (toggle){
    toggle.addEventListener("click",()=>{
        if (toggle.classList.contains("btn-secondary")){
            //toggle button color
            toggle.classList.remove("btn-secondary");
            toggle.classList.add("btn-success");
            //change led status name
            toggle.innerHTML = "LED ON"
            //esp32LedStatus.value = "ON"
        }
        else{
            toggle.classList.remove("btn-success");
            toggle.classList.add("btn-secondary");
            toggle.innerHTML = "LED OFF"
            //esp32LedStatus.value = "OFF"
        }
    })
}