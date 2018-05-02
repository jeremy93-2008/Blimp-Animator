//temp - put image inside -
const {remote,clipboard} = require("electron");
const dialog = remote.dialog;
const {BrowserWindow} = remote;
const app = remote.app;
const fs = require("fs");
const extra = require("fs-extra");
const path = require("path");
const vue = require("vue");
let refListenerBinding = {};

function NuevoArchivo()
{
    const webview = document.querySelector("#webview")
    let text = "";
    if(webview.innerHTML.trim() == "")
    {
        webview.innerHTML = text;
        document.querySelector("#outline ul").innerHTML = "";
        InspectorEsconder(false);
    }
    else
    {
        dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
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
        webview.innerHTML = "";
        InspectorEsconder(false);
        document.querySelector("#outline ul").innerHTML = "";
    }else if(num == 1){
        webview.innerHTML = "";
        InspectorEsconder(false);
        document.querySelector("#outline ul").innerHTML = "";
    }else{
        console.log("Se cancelo la operación");    
    }
}
function circleView()
{
    const webview = document.querySelector("#webview")
    let circle = document.createElement("div");
    circle.className = "default";
    circle.id = "elm-"+parseInt((Math.random()*1000));
    circle.style.border = "solid 2px black"; 
    circle.style.display = "inline-block";
    circle.style.backgroundSize = "cover";
    circle.style.borderRadius = "50%"
    circle.style.width = "50px";
    circle.style.height = "50px";
    circle.style.position = "relative";
    circle.addEventListener("click",function(evt){ActivaInspector(circle,evt);});
    webview.appendChild(circle);
    Creacion(circle);
}
function rectangleView()
{
    const webview = document.querySelector("#webview")
    let circle = document.createElement("div");
    circle.className = "default";
    circle.id = "elm-"+parseInt((Math.random()*1000));
    circle.style.display = "inline-block";
    circle.style.backgroundSize = "cover";
    circle.style.border = "solid 2px black";
    circle.style.width = "100px";
    circle.style.height = "50px";
    circle.style.position = "relative";
    circle.addEventListener("click",function(evt){ActivaInspector(circle,evt);});
    webview.appendChild(circle);
    Creacion(circle);
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
                extra.copySync(pathFiles[0],__dirname+"/img/client/"+path.win32.basename(pathFiles[0]));
                image.src = "./img/client/"+path.win32.basename(pathFiles[0]);
                image.style.width = "150px";
                image.style.position = "relative";
                image.addEventListener("click",function(evt){ActivaInspector(image,evt);});
                webview.appendChild(image);
                annadirALibreria(image);
                Creacion(image);
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
    text.style.backgroundSize = "cover";
    text.className = "default";
    text.style.position = "relative";
    text.id = "elm-"+parseInt((Math.random()*1000));
    text.addEventListener("click",function(evt){ActivaInspector(text,evt);});
    webview.appendChild(text);
    Creacion(text);
}
function htmlView()
{
    const webview = document.querySelector("#webview")
    let obj = document.createElement("div");  
    let CodeWindow = new BrowserWindow(
        {
          width: 680, 
          height: 420,
          minWidth: 680,
          minHeight: 420,
          modal:true,
          icon:"img/logo-32.png",
          resizable:false,
          minimizable:false,
          parent:BrowserWindow.getAllWindows()[0],
          backgrounColor: "#333",
          nativeWindowOpen: true
        })
      CodeWindow.loadURL(path.join(__dirname,"/htmlcode.html"))
      CodeWindow.setMenu(null);
      CodeWindow.on('closed', function () {
        if(localStorage.codigo != "null")
        {
            obj.id = "elm-"+parseInt((Math.random()*1000));
            obj.className = "default";
            obj.innerHTML = localStorage.codigo;
            obj.style.position = "relative";
            obj.style.backgroundSize = "cover";
            obj.addEventListener("click",function(evt){ActivaInspector(obj,evt);});
            webview.appendChild(obj);
            Creacion(obj);
            localStorage.codigo = null;
        }
        CodeWindow = null
      })
}
function PonerImagen(pathToElm)
{
    dialog.showOpenDialog(
        {
            "title":"Elija una imagen",
            "defaultPath":app.getAppPath()+"\\src\\img\\client",
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
                var evento = new Event("input");
                extra.copySync(pathFiles[0],__dirname+"/img/client/"+path.win32.basename(pathFiles[0]));
                let ruta = "./img/client/"+path.win32.basename(pathFiles[0]);
                let image = document.createElement("img");
                image.src = "./img/client/"+path.win32.basename(pathFiles[0]);
                annadirALibreria(image);
                document.querySelector(pathToElm).value = ruta;
                document.querySelector(pathToElm).dispatchEvent(evento);
            }
        })
}
function Creacion(elm)
{
    let lista_elm = document.querySelector("#outline ul");
    var newLine = document.createElement("li");
    newLine.setAttribute("identificador",elm.nodeName.toLowerCase()+"#"+elm.id+"."+elm.className);
    newLine.style.width = "100%";
    newLine.style.padding = "1px 15px";
    newLine.addEventListener("click",function(evt)
    {
        ActivaInspector(elm,evt);
    });
    newLine.innerHTML = "<div style='width: 8px;height: 8px;display: inline-block;margin-right: 5px;background: #868585;border-radius:50%;'></div><b>"+elm.nodeName.toLowerCase()+"#"+elm.id+"."+elm.className+"</b>";
    lista_elm.appendChild(newLine)
}
function ActivaInspector(that,evt)
{
    let inspector = document.getElementById("inspector");
    let elementos = inspector.querySelector(".elemento");
    InspectorEsconder(true);
    seleccionarObjInspector(that);
    elementos.querySelector("#titulo").innerHTML = that.nodeName.toLowerCase()+"#"+that.id+"."+that.className;
    GenerarInspector(that,elementos);
    evt.stopPropagation();
}
function GenerarInspector(that,list)
{
    let computed = window.getComputedStyle(that,null)
    let list_elm = list.querySelectorAll(".elm");

    // Ponemos la posición elegida en uno de los tres botones de posicion
    SetPosicionBoton(computed,that)

    let anteriorClase = "";

    for(let elm of list_elm)
    {
        let clase = elm.className.replace("_elm","").replace("elm","").trim();
        // Le quitamos los Eventattach que podian tener antes
        if(refListenerBinding[clase] != null && anteriorClase != clase)
        {
            elm.removeEventListener("input",refListenerBinding[clase],true);
            elm.parentNode.removeEventListener("change",refListenerBinding[clase],true);
            delete refListenerBinding[clase];
        }

        if(elm.nodeName == "INPUT")
        {
            if(clase != "id" && clase != "class")
                if(elm.type == "number")
                    if(clase == "box-shadow" || clase == "text-shadow")
                        elm.value = parseFloat(computed.getPropertyValue(clase).replace("rgb(0, 0, 0) 0px 0px ","").replace(" 0px","").replace("px","").trim()) || 0;
                    else
                        elm.value = parseFloat(computed.getPropertyValue(clase).replace("px","").replace("%","").trim()) || 0;
                else if(elm.type == "color")
                    elm.value = colorEnHex(computed.getPropertyValue(clase).replace("px","").replace("%","").trim());
                else
                    if(clase == "background-image")
                        elm.value = computed.getPropertyValue(clase).replace("url(\"","").replace("\")","").trim();
                    else
                        elm.value = computed.getPropertyValue(clase).replace("px","").trim();
            else
                if(clase == "id")
                    elm.value = that.id;
                else
                    elm.value = that.className;
            refListenerBinding[clase] = function(){newInfoToHTMLElement(elm,that)};
            elm.addEventListener("input",refListenerBinding[clase],true);
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
            if(refListenerBinding[clase] == null)
            {
                refListenerBinding[clase] = function(){newInfoToHTMLElement(elm,that)};
                elm.parentNode.addEventListener("change",refListenerBinding[clase],true);                
            }
        }
        anteriorClase = clase;
    }
}
function SetPosicionBoton(computed,that)
{
    let listabtn = document.querySelectorAll("#menu .right button");
    let inputPosition = {};
    for(let btn of listabtn)
    {
        if(refListenerBinding[btn.id] != null)
        {
            btn.removeEventListener("click",refListenerBinding[btn.id],true);
            delete refListenerBinding[btn.id];
        }
        var texto = document.createElement("input");
        texto.className = "elm position_elm";
        texto.value = btn.id.replace("elm-","").trim();
        inputPosition[btn.id] = texto;
        refListenerBinding[btn.id] = function(){newInfoToHTMLElement(inputPosition[btn.id],that);SetPosicionBoton(computed,that)};
        btn.addEventListener("click",refListenerBinding[btn.id],true);
        btn.className = "";
    }    
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
function annadirALibreria(img)
{
    const list = document.querySelector("#libreria ul");
    let new_img = document.createElement("li");
    new_img.style.padding = "8px 35px";
    new_img.style.color = "white";
    new_img.style.fontSize = "12px";
    new_img.innerHTML = "<div ondblclick='AbrirImagen(\""+img.src+"\")'><img src='"+img.src+"' style='height: 24px;margin-right: 5px;border: solid 3px #868585;border-radius: 10px;' ><b>"+img.src.split("/")[img.src.split("/").length-1]+"</b><button title='Eliminar esta imagen' class='deleteImg'><i class='fa fa-times' aria-hidden='true'></i></button></div>";
    list.appendChild(new_img);
}
function AbrirImagen(ruta)
{
    let ImgWindow = new BrowserWindow(
        {
          width: 480, 
          height: 320,
          minWidth: 480,
          minHeight: 320,
          modal:true,
          title:"Imagen",
          icon:"img/logo-32.png",
          resizable:false,
          minimizable:false,
          parent:BrowserWindow.getAllWindows()[0],
          backgrounColor: "#333",
          nativeWindowOpen: true
        })
    ImgWindow.loadURL(ruta)
    ImgWindow.setMenu(null);
    ImgWindow.on('closed', function () {
        ImgWindow = null
      })
}
function seleccionarObjInspector(that)
{
    let tituloEnObj = that.nodeName.toLowerCase()+"#"+that.id+"."+that.className;
    let list = document.querySelectorAll("#outline ul li");
    for(let line of list)
    {
        line.className = "";
        if(tituloEnObj == line.getAttribute("identificador"))
            line.className = "selected"
    }
}
function InspectorEsconder(elemento)
{
    document.querySelector("#btn-inspector").style.animation = "";
    let elementos = inspector.querySelector(".elemento");
    elementos.style.display = (elemento?"block":"none");
    inspector.querySelector(".nothing").style.display = (elemento?"none":"block");
    setTimeout(function()
    {
        if(elementos.style.display == "block")
            document.querySelector("#btn-inspector").style.animation = "orange 1s linear";
    },50)
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
        valor = that.value;
    }
    let elms_post = document.querySelectorAll("."+that.className.replace(" ",".")+".post");
    if(elms_post != null)
    {
        for(let elm of elms_post)
        {
            if(elm.nodeName == "OPTION" && elm.parentNode.selectedOptions[0] == elm)
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
}