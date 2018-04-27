//temp - put image inside -
const {remote,clipboard} = require("electron");
const dialog = remote.dialog;
const app = remote.app;
const fs = require("fs");
const vue = require("vue");

function NuevoArchivo()
{
    const webview = document.querySelector("#webview")
    let text = "";
    if(webview.innerHTML.trim() == "")
    {
        webview.innerHTML = text;
    }
    else
    {
        document.querySelector(".bg-opa-bl").style.display = "block";
        dialog.showMessageBox(
            {
                "title":"Atención",
                "type":"warning",
                "buttons":["Guardar","No guardar","Cancelar"],
                "defaultId":0,
                "cancelId":2,
                "noLink":true,
                "message":"El lienzo contiene elementos que se estaban editando. ¿Desea guardar esos cambios?"
            },mensajeguardar);
    }
        
}
function mensajeguardar(num,chknum)
{
    if(num==0)
        console.log("Guardar");
    else if(num == 1)
        console.log("No se guardo");
    else
        console.log("Se cancelo la operación");
        document.querySelector(".bg-opa-bl").style.display = "none";
}
function circleView()
{
    const webview = document.querySelector("#webview")
    let circle = document.createElement("div");
    circle.style.border = "solid 2px black"; 
    circle.style.display = "inline-block";
    circle.style.borderRadius = "50%"
    circle.style.width = "50px";
    circle.style.height = "50px";
    webview.appendChild(circle)
}
function rectangleView()
{
    const webview = document.querySelector("#webview")
    let circle = document.createElement("div");
    circle.style.display = "inline-block";
    circle.style.border = "solid 2px black";
    circle.style.width = "100px";
    circle.style.height = "50px";
    webview.appendChild(circle)
}
function imageView()
{
    const webview = document.querySelector("#webview")
    let image = document.createElement("img");
    dialog.showOpenDialog(
        {
            "title":"Elija una imagen",
            "defaultPath":app.getPath("pictures"),
            "filters":[{
                name: 'Imagen',
                extensions: ['png','jpg','gif','bmp','svg','jpeg']
             }
            ],
            "properties":["openFile"]
        },function(pathFiles,bmk)
        {
            if(pathFiles != undefined && pathFiles[0] != "")
            {
                image.src = pathFiles[0];
                image.style.width = "150px"
                webview.appendChild(image)
            }
        })
}
function textView()
{
    const webview = document.querySelector("#webview")
    let text = document.createElement("pre");
    text.setAttribute("contentEditable","true")
    text.style.fontFamily = "sans-serif";
    text.innerText = "Hello World!";
    text.style.display = "inline-block";
    text.style.width = "150px";
    text.style.minHeight = "25px";
    webview.appendChild(text);
}
function PonerImagen(pathToElm)
{
    dialog.showOpenDialog(
        {
            "title":"Elija una imagen",
            "defaultPath":app.getPath("pictures"),
            "filters":[{
                name: 'Imagen',
                extensions: ['png','jpg','gif','bmp','svg','jpeg']
             }
            ],
            "properties":["openFile"]
        },function(pathFiles,bmk)
        {
            if(pathFiles != undefined && pathFiles[0] != "")
            {
                document.querySelector(pathToElm).value = pathFiles[0];
            }
        })
}