//temp - put image inside -
const {remote,clipboard} = require("electron");
const dialog = remote.dialog;
const {BrowserWindow} = remote;
const app = remote.app;
const fs = require("fs");
const extra = require("fs-extra");
const path = require("path");
let refListenerBinding = {};
let seleccionado = null;

function NuevoArchivo()
{
    const webview = document.querySelector("#webview")
    let text = "";
    if(webview.innerHTML.trim() == "")
    {
        webview.innerHTML = text;
        document.querySelector("#outline ul").innerHTML = "";
        timelinegui.anims = [];
        timelinegui.tracks = [];
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
function AbrirArchivo()
{
    
}
function mensajeguardar(num,chknum)
{
    const webview = document.querySelector("#webview")
    if(num==0){
        console.log("Guardar");
        webview.innerHTML = "";
        InspectorEsconder(false);
        document.querySelector("#outline ul").innerHTML = "";
        beginTo = 0;
        duration = 0;
        timelinegui.anims = [];
        timelinegui.tracks = [];
    }else if(num == 1){
        webview.innerHTML = "";
        InspectorEsconder(false);
        document.querySelector("#outline ul").innerHTML = "";
        beginTo = 0;
        duration = 0;
        timelinegui.anims = [];
        timelinegui.tracks = [];
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
function imageView(src)
{
    const webview = document.querySelector("#webview")
    let image = document.createElement("img");
    image.className = "default";
    image.draggable = false;
    image.id = "elm-"+parseInt((Math.random()*1000));
    if (src == null)
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
                let annadir = true;
                if(document.querySelector("#libreria ul").innerHTML.indexOf(path.win32.basename(pathFiles[0])) != -1)
                    annadir = false;
                extra.copySync(pathFiles[0],__dirname+"/img/client/"+path.win32.basename(pathFiles[0]));
                image.src = "./img/client/"+path.win32.basename(pathFiles[0]);
                image.style.width = "150px";
                image.style.position = "relative";
                image.addEventListener("click",function(evt){ActivaInspector(image,evt);});
                webview.appendChild(image);
                if(annadir)
                    annadirALibreria(image);
                Creacion(image);
            }
        })       
    }else
    {
        let annadir = true;
        if(document.querySelector("#libreria ul").innerHTML.indexOf(path.win32.basename(src)) != -1)
            annadir = false;
        image.src = "./img/client/"+path.win32.basename(src);
        image.style.width = "150px";
        image.style.position = "relative";
        image.addEventListener("click",function(evt){ActivaInspector(image,evt);});
        webview.appendChild(image);
        if(annadir)
            annadirALibreria(image);
        Creacion(image);
    }
    
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
function multimediaView(name,src)
{
    const webview = document.querySelector("#webview")
    let tag = document.createElement(name);
    tag.className = "default";
    tag.id = "elm-"+parseInt((Math.random()*1000));
    tag.style.position = "relative";
    tag.style.backgroundCover = "relative";
    tag.controls = "true";
    if(src == undefined)
    {
        dialog.showOpenDialog(
            {
                "title":"Elija un "+name,
                "defaultPath":app.getPath("documents"),
                "filters":[{
                    name: 'Multimedia',
                    extensions: ['mp4','ovg','ogg','mp3','wav','webm']
                 }
                ],
                "properties":["openFile"]
            },function(pathFiles,bmk)
            {
                if(pathFiles != undefined && pathFiles[0] != "")
                {
                    let annadir = true;
                    if(document.querySelector("#libreria ul").innerHTML.indexOf(path.win32.basename(pathFiles[0])) != -1)
                        annadir = false;
                    extra.copySync(pathFiles[0],__dirname+"/img/client/"+path.win32.basename(pathFiles[0]));
                    tag.src = __dirname+"/img/client/"+path.win32.basename(pathFiles[0]);
                    tag.addEventListener("click",function(evt){ActivaInspector(tag,evt);});
                    webview.appendChild(tag);
                    if(annadir)
                        annadirALibreria(tag);
                    Creacion(tag);
                }
            })
    }else
    {
        let annadir = true;
        if(document.querySelector("#libreria ul").innerHTML.indexOf(path.win32.basename(src)) != -1)
            annadir = false;
        tag.src = __dirname+"/img/client/"+path.win32.basename(src);
        tag.addEventListener("click",function(evt){ActivaInspector(tag,evt);});
        webview.appendChild(tag);
        if(annadir)
            annadirALibreria(tag);
        Creacion(tag);
    }
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
function PonerImagen(pathToElm,video)
{
    let filtro = ['png','jpg','gif','bmp','svg','jpeg'];
    if(video == "video")
        filtro = ['mp4','ovg','ogg','mp3','wav','webm']
    else if(video == "todo")
        filtro = ['mp4','ovg','ogg','mp3','wav','png','jpg','gif','bmp','svg','jpeg']
    else
        filtro = ['png','jpg','gif','bmp','svg','jpeg']
    dialog.showOpenDialog(
        {
            "title":"Elija un Contenido",
            "defaultPath":app.getAppPath()+"\\src\\img\\client",
            "filters":[{
                name: 'Contenido',
                extensions: filtro
             }
            ],
            "properties":["openFile"]
        },function(pathFiles,bmk)
        {
            if(pathFiles != undefined && pathFiles[0] != "")
            {
                var evento = new Event("input");
                let annadir = true;
                if(document.querySelector("#libreria ul").innerHTML.indexOf(path.win32.basename(pathFiles[0])) != -1)
                    annadir = false;
                extra.copySync(pathFiles[0],__dirname+"/img/client/"+path.win32.basename(pathFiles[0]));
                let ruta = "./img/client/"+path.win32.basename(pathFiles[0]);
                let image = "";
                let imageArray = ['.png','.jpg','.gif','.bmp','.svg','.jpeg'];
                let ext = ruta.substring(ruta.lastIndexOf("."));
                if(imageArray.indexOf(ext) == -1){
                    image = document.createElement("audio");
                }else{
                    image = document.createElement("img");
                }
                image.src = "./img/client/"+path.win32.basename(pathFiles[0]);
                if(annadir)    
                    annadirALibreria(image,path.win32.basename(pathFiles[0]));
                document.querySelector(pathToElm).value = ruta;
                document.querySelector(pathToElm).dispatchEvent(evento);
            }
        })
}
function Creacion(elm)
{
    elm.addEventListener("mousedown",function(evt){Mover(elm,evt);})
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
function AnnadirContenido(that)
{
    let imagen = ['.png','.jpg','.gif','.bmp','.svg','.jpeg'];
    let video = ['.mp4','.ovg','.webm'];
    let audio = ['.ogg','.mp3','.wav'];
    let ruta = that.querySelector("img").getAttribute("fuente");
    let extension = ruta.substring(ruta.lastIndexOf("."));
    if(imagen.indexOf(extension) != -1)
        imageView(ruta);
    else if(video.indexOf(extension) != -1)
        multimediaView('video',ruta);
    else
        multimediaView('audio',ruta);
}
function ActivaInspector(that,evt)
{
    let inspector = document.getElementById("inspector");
    let elementos = inspector.querySelector(".elemento");
    elmSeleccionado = that;
    InspectorEsconder(true,false);
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

    // Enseñamos la fuente de imagen si es un objeto img
    if(that.nodeName == "IMG" || that.nodeName == "VIDEO" | that.nodeName == "AUDIO")
        document.querySelector(".elm-imagen").style.display = "block";
    else
        document.querySelector(".elm-imagen").style.display = "none";
    
    if(that.nodeName == "VIDEO" | that.nodeName == "AUDIO")
        document.querySelector(".elm-video").style.display = "block";
    else
        document.querySelector(".elm-video").style.display = "none";

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
            if(clase != "id" && clase != "class" && clase != "src")
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
                else if(clase == "src")
                    elm.value = that.src;
                else
                    elm.value = that.className;
            refListenerBinding[clase] = function(){newInfoToHTMLElement(elm,that)};
            elm.addEventListener("input",refListenerBinding[clase],true);
        }else if(elm.nodeName == "OPTION")
        {
            //elm option this elemento
            let valor = elm.value;
            let valorObj = computed.getPropertyValue(clase.replace(" post",""));
            if(clase == "autoplay")
            {
                if(that.getAttribute("autoplay") == null)
                    valorObj = false;
                else
                    valorObj = true;
            }
            if(clase == "controls")
            {
                if(that.getAttribute("controls") == null)
                    valorObj = false;
                else
                    valorObj = true;
            }
            if(elm.className.indexOf("post") != -1)
            {
                if(valorObj.toString().indexOf(valor) != -1)
                    elm.selected = true;
            }else
            {
                if(valor.toString().toLowerCase() == valorObj.toString().toLowerCase())
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
function VisibleInvisible(that,valor)
{
    let computed = window.getComputedStyle(that,null);
    let visible = computed.getPropertyValue("visibility");
    if(valor != null)
        visible = valor;
    let btn = document.querySelector("#menu .right-elemento button");
    if(that != null)
    {
        let texto = document.createElement("input");
        texto.className = "elm visibility_elm"
        if(visible == "visible" )
        {
            btn.querySelector("i").className = "fa fa-eye";
            texto.value = "hidden";
        }else
        {
            btn.querySelector("i").className = "fa fa-eye-slash";
            texto.value = "visible";            
        }
        if(refListenerBinding["visibility-button"] != null)
        {
            btn.removeEventListener("click",refListenerBinding["visibility-button"])
            delete refListenerBinding["visibility-button"]
        }
        refListenerBinding["visibility-button"] = function(evt)
        {
            newInfoToHTMLElement(texto,that);
            VisibleInvisible(that);
            ActivaInspector(that,evt);
        }
        btn.addEventListener("click",refListenerBinding["visibility-button"])
    }
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
function annadirALibreria(img,texto)
{
    const list = document.querySelector("#libreria ul");
    let new_img = document.createElement("li");
    new_img.style.padding = "8px 35px";
    new_img.style.color = "white";
    new_img.style.fontSize = "12px";
    let textoImg = img.src.split("/")[img.src.split("/").length-1];
    if(texto != undefined)
        textoImg = texto;
    if(textoImg.length > 10)
    {
        let long = textoImg.length;
        textoImg = textoImg.substring(0,4)+"..."+textoImg.substring(long-3,long);
    }
    let ruta = img.src;
    if(img.nodeName != "IMG")
    {
        ruta = "img/play-button.png";
    }
    new_img.innerHTML = "<div ondblclick='AbrirImagen(\""+img.src+"\")'><img fuente='"+img.src.replace(/\//g,"\\").replace(__dirname,".").replace("file:\\\\\\","")+"' class='library' src='"+ruta+"' style='width: 35px;margin-right: 5px;border: solid 3px #868585;border-radius: 10px;' ><b style='display: inline-block;width: 71px;max-width:71px;'>"+textoImg+"</b><button onclick='AnnadirContenido(this.parentNode)' title='Añadir este contenido al lienzo' class='deleteImg'><i class=\"fa fa-plus\" aria-hidden=\"true\"></i></button><button onclick='EliminarContenido(this.parentNode)' title='Eliminar este contenido' class='deleteImg'><i class='fa fa-times' aria-hidden='true'></i></button></div>";
    list.appendChild(new_img);
}
function EliminarContenido(that)
{
    let ruta = that.querySelector("img").getAttribute("fuente");
    let objLigados = document.querySelectorAll("*[src*='"+ruta.split("\\")[ruta.split("\\").length-1]+"']:not(.library)");
    if(objLigados.length > 0)
    {
        dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
                {
                    "title":"Atención",
                    "type":"warning",
                    "buttons":["Aceptar","Cancelar"],
                    "defaultId":1,
                    "cancelId":1,
                    "noLink":true,
                    "message":"Si borra este contenido multimedia, los objetos relacionados pueden dejar de funcionar. ¿Desea eliminar este contenido?"
                },function(num)
                {
                    if(num==0)
                    {
                        let fichero = __dirname + "\\img\\client\\" + ruta.split("\\")[ruta.split("\\").length-1];
                        if(extra.existsSync(fichero))
                        {
                            extra.removeSync(fichero);
                            that.parentNode.remove();
                            for(let obj of objLigados)
                                obj.src = obj.src+"#";
                        }                   
                    }

                });        
    }else
    {
        let fichero = __dirname + "\\img\\client\\" + ruta.split("\\")[ruta.split("\\").length-1];
        if(extra.existsSync(fichero))
        {
            extra.removeSync(fichero);
            that.parentNode.remove();
        }                
    }

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
          title:"Medio",
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

    let lista = document.querySelectorAll("#webview *");
    for(let obj of lista)
    {
        obj.style.outline = "none";
    }
    that.style.outline = "solid 2px #0a80c4";

    VisibleInvisible(that);

    let list = document.querySelectorAll("#outline ul li");
    for(let line of list)
    {
        line.className = "";
        if(tituloEnObj == line.getAttribute("identificador"))
            line.className = "selected"
    }
}
function InspectorEsconder(elemento,bool)
{
    document.querySelector("#btn-inspector").style.animation = "";
    let elementos = inspector.querySelector(".elemento");
    elementos.style.display = (elemento?"block":"none");
    if(!elemento)
        elmSeleccionado = null;
    inspector.querySelector(".nothing").style.display = (elemento?"none":"block");
    setTimeout(function()
    {
        if(bool == undefined)
        {
            const list = document.querySelectorAll("#webview *");
            for(obj of list)
            {
                obj.style.outline = "none";
            }
        }
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
    let tabla = clase.split("-")
    tabla.forEach(function(currentValue,index,array)
    {
        if(index > 0)
            array[index] = currentValue.substring(0,1).toUpperCase()+currentValue.substring(1)
    });
    clase = tabla.join("");
    valor = (that.getAttribute("pre")||"") + valor + (that.getAttribute("post")||""); 
    if(clase == "id" || clase == "class" || clase == "src")
        HTMLobj.setAttribute(clase,valor);
    else if(clase == "autoplay" || clase == "controls")
        (valor=="true")?HTMLobj.setAttribute(clase,valor):HTMLobj.removeAttribute(clase);
    else
        HTMLobj.style[clase] = valor;

    VisibleInvisible(that,valor);
}
// Movimiento de los elementos
let movimientoView = null;
let detenerMovimiento = null;
let elmnt = null;
// OnMouseDown
function Mover(elm,evt)
{
    elmnt = elm;

    let lista = document.querySelectorAll("#webview *");
    for(let obj of lista)
    {
        obj.style.outline = "none";
    }
    elm.style.outline = "solid 2px #0a80c4";
    if(!evt.ctrlKey && !evt.shiftKey)
        Movimiento(elm,evt);
    else if(evt.ctrlKey && evt.shiftKey)
    {
        Rotar(elm,evt);
    }else
    {
        Redimensionar(elm,evt);
    }
}
function Movimiento(elm,evt)
{
    let btnstay = document.querySelectorAll("button.stay");
    for(let item of btnstay)
    {
        item.className = "stay";
    }
    btnstay[1].className = "stay selected";

    evt = evt || window.event;
    // get the mouse cursor position at startup:
    elm.style.position = "absolute";
    pos3 = evt.clientX;
    pos4 = evt.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
}
function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
function closeDragElement() {
    let btnstay = document.querySelectorAll("button.stay");
    for(let item of btnstay)
    {
        item.className = "stay";
    }
    btnstay[0].className = "stay selected";
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
}
// Rotación de los elementos
function Rotar(elm,evt)
{
    let btnstay = document.querySelectorAll("button.stay");
    for(let item of btnstay)
    {
        item.className = "stay";
    }
    btnstay[3].className = "stay selected";

    evt = evt || window.event;
    // get the mouse cursor position at startup:
    pos3 = evt.clientX;
    pos4 = evt.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementRotate;
}
function elementRotate(evt)
{
    var boxCenter = [elmnt.offsetLeft+parseFloat(elmnt.style.width.replace("px",""))/2, elmnt.offsetTop+parseFloat(elmnt.style.height.replace("px",""))/2];
    var angle = Math.atan2(evt.pageX - boxCenter[0], - (evt.pageY - boxCenter[1]) )*(180/Math.PI);      
    elmnt.style.transform = "rotate("+angle+"deg)";
}
// Redimensionar de los elementos
function Redimensionar(elm,evt)
{
    let btnstay = document.querySelectorAll("button.stay");
    for(let item of btnstay)
    {
        item.className = "stay";
    }
    btnstay[2].className = "stay selected";

    evt = evt || window.event;
    // get the mouse cursor position at startup:
    pos3 = evt.clientX;
    pos4 = evt.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementRedimensionar;
}
function elementRedimensionar(e)
{
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = e.clientX - pos3;
    pos2 = e.clientY - pos4;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.width = (elmnt.offsetWidth + pos1) + "px";
    elmnt.style.height = (elmnt.offsetHeight + pos2) + "px";
}
function KeyboardManager(evt)
{
    if(evt.code == "Delete")
        DelFrame();
    console.log(evt);
}