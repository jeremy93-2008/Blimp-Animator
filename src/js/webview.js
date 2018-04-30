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
        InspectorEsconder(false);
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
    const webview = document.querySelector("#webview")
    if(num==0){
        console.log("Guardar");
    }else if(num == 1){
        webview.innerHTML = "";
        InspectorEsconder(false);
    }else{
        console.log("Se cancelo la operación");    
    }
    document.querySelector(".bg-opa-bl").style.display = "none";
}
function circleView()
{
    const webview = document.querySelector("#webview")
    let circle = document.createElement("div");
    circle.className = "default";
    circle.id = "elm-"+parseInt((Math.random()*1000));
    circle.style.border = "solid 2px black"; 
    circle.style.display = "inline-block";
    circle.style.borderRadius = "50%"
    circle.style.width = "50px";
    circle.style.height = "50px";
    circle.style.position = "relative";
    circle.addEventListener("click",function(evt){ActivaInspector(circle,evt);});
    webview.appendChild(circle)
}
function rectangleView()
{
    const webview = document.querySelector("#webview")
    let circle = document.createElement("div");
    circle.className = "default";
    circle.id = "elm-"+parseInt((Math.random()*1000));
    circle.style.display = "inline-block";
    circle.style.border = "solid 2px black";
    circle.style.width = "100px";
    circle.style.height = "50px";
    circle.style.position = "relative";
    circle.addEventListener("click",function(evt){ActivaInspector(circle,evt);});
    webview.appendChild(circle)
}
function imageView()
{
    const webview = document.querySelector("#webview")
    let image = document.createElement("img");
    image.className = "default";
    image.id = "elm-"+parseInt((Math.random()*1000));
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
                image.style.width = "150px";
                image.style.position = "relative";
                image.addEventListener("click",function(evt){ActivaInspector(image,evt);});
                webview.appendChild(image);
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
    text.className = "default";
    text.style.position = "relative";
    text.id = "elm-"+parseInt((Math.random()*1000));
    text.addEventListener("click",function(evt){ActivaInspector(text,evt);});
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
function ActivaInspector(that,evt)
{
    let inspector = document.getElementById("inspector");
    let elementos = inspector.querySelector(".elemento");
    InspectorEsconder(true);
    elementos.querySelector("#titulo").innerHTML = that.nodeName.toLowerCase()+"#"+that.id+"."+that.className;
    GenerarInspector(that,elementos);
    evt.stopPropagation();
}
function GenerarInspector(that,list)
{
    let computed = window.getComputedStyle(that,null)
    let list_elm = list.querySelectorAll(".elm");

    // Ponemos la posición elegida en uno de los tres botones de posicion
    SetPosicionBoton(computed)

    for(let elm of list_elm)
    {
        let clase = elm.className.replace("_elm","").replace("elm","").trim();
        if(elm.nodeName == "INPUT")
        {
            if(clase != "id" && clase != "class")
                if(elm.type == "number")
                    elm.value = parseInt(computed.getPropertyValue(clase).replace("px","").replace("%","").trim()) || 0;
                else if(elm.type == "color")
                    elm.value = colorEnHex(computed.getPropertyValue(clase).replace("px","").replace("%","").trim());
                else
                    elm.value = computed.getPropertyValue(clase).replace("px","").trim();
            else
                if(clase == "id")
                    elm.value = that.id;
                else
                    elm.value = that.className;
            elm.addEventListener("input",function(evt){newInfoToHTMLElement(elm,that,evt)});
        }else if(elm.nodeName == "OPTION")
        {
            let valor = elm.value;
            let valorObj = computed.getPropertyValue(clase.replace(" post",""));
            if(elm.className.indexOf("post") != -1)
            {
                if(valorObj.toString().indexOf(valor) != -1)
                    elm.selected = true;
            }else
            {
                if(valor.toString().toLowerCase() == valorObj.toLowerCase())
                    elm.selected = true;
            }
            elm.parentNode.addEventListener("change",function(evt){newInfoToHTMLElement(elm,that,evt)});
        }
    }
}
function SetPosicionBoton(computed)
{
    let listabtn = document.querySelectorAll("#menu .right button");
    for(let btn of listabtn)    
        btn.style.className = "";
    document.querySelector("#elm-"+computed.getPropertyValue("position")).className = "selected"
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function colorEnHex(texto)
{
    texto = texto.replace("(0, 0, 0","(10, 10, 10").replace("(255, 255, 255","(245, 245, 245");
    let tabla = texto.replace("rgb(","").replace("rgba(","").replace(")","").trim().split(",");
    return rgbToHex(parseInt(tabla[0].trim()),parseInt(tabla[1].trim()),parseInt(tabla[2].trim()));
}
function InspectorEsconder(elemento)
{
    let elementos = inspector.querySelector(".elemento");
    elementos.style.display = (elemento?"block":"none");
    document.querySelector("#menu .right").style.display = (elemento?"block":"none");
    inspector.querySelector(".nothing").style.display = (elemento?"none":"block");
}
function newInfoToHTMLElement(that,HTMLobj,evt)
{
    if(that.nodeName == "OPTION")
    {
        that = that.parentNode.selectedOptions[0];
    }
    let clase = that.className.replace("_elm","").replace("elm","").trim();
    let valor = that.value;
    if(that.className.indexOf("post") != -1)
    {
        clase = clase.replace(" post","")
        that = document.querySelector("."+that.className.replace(" ",".").replace(" post",""));
    }
    let elms_post = document.querySelectorAll("."+that.className.replace(" ",".")+".post");
    if(elms_post != null)
    {
        for(let elm of elms_post)
        {
            if(elm.nodeName == "OPTION" && elm.selected == true)
                valor += elm.value;
            else if(elm.nodeName == "INPUT" || elm.nodeName == "COLOR")
                valor += elm.value;
        }
    }
    valor = (that.getAttribute("pre")||"") + valor + (that.getAttribute("post")||""); 
    if(clase == "id" || clase == "class")
        HTMLobj.setAttribute(clase,valor);
    else
        HTMLobj.style[clase] = valor;
    evt.stopPropagation();
}