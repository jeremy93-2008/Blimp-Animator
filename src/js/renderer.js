// Menu Renderer
let robot = require('robotjs');

let openedMenu = false;
let currentMenu = "";

window.addEventListener("load", function () {
    let listLI = document.querySelectorAll(".top ul li");
    for (let li of listLI) {
        li.addEventListener("click", function (ev) {
            let lista = document.querySelectorAll(".top ul li ul");
            let insideMenu = true;
            let visible = false;
            if (this.querySelector("ul") != undefined) {
                visible = this.querySelector("ul").style.display == "block";
                openedMenu = false;
                insideMenu = false;
            }
            for (let item of lista) {
                item.parentNode.className = "";
                item.style.display = "none";
                if (item == this.querySelector("ul"))
                    if (!insideMenu && !visible) {
                        this.querySelector("ul").style.display = "block";
                        this.className = "selected";
                        openedMenu = true;
                        currentMenu = this;
                    }
            }
            ev.stopPropagation();
        })
        li.addEventListener("mouseenter", function () {
            let lista = document.querySelectorAll(".top ul li ul");
            let visible = this.querySelector("ul") != undefined ? this.querySelector("ul").style.display == "block" : false;
            if (openedMenu && !(currentMenu.contains(this))) {
                for (let item of lista) {
                    item.parentNode.className = "";
                    item.style.display = "none";
                    if (item == this.querySelector("ul"))
                        if (!visible) {
                            this.querySelector("ul").style.display = "block";
                            this.className = "selected";
                            openedMenu = true;
                            currentMenu = this;
                        }
                }
            }
        })
    }
    let btnstay = document.querySelectorAll("button.stay");
    btnstay[0].className = "stay selected";
    const menuInspector = document.querySelectorAll(".inspector_menu button");
    for (let btn of menuInspector) {
        btn.addEventListener("click", function () {
            let btnS = this.parentNode.querySelectorAll("button");
            for (let btn of btnS) {
                let identificador = btn.id.replace("btn-", "");
                btn.className = "";
                document.querySelector("#" + identificador).style.display = "none";
            }
            document.querySelector("#menu .right").style.display = (this.id.indexOf("inspector") != -1 ? "block" : "none")
            document.querySelector("#menu .right-elemento").style.display = (this.id.indexOf("outline") != -1 ? "block" : "none")
            document.querySelector("#menu .right-library").style.display = (this.id.indexOf("libreria") != -1 ? "block" : "none")
            let identificador = this.id.replace("btn-", "");
            this.className = "selected";
            document.querySelector("#" + identificador).style.display = "block";
        })
    }
    document.body.addEventListener("keydown", function (evt) { KeyboardManager(evt) })
    document.querySelector("#add_frame").addEventListener("click", function (evt) { AnnadirFrame(evt) });
    document.querySelector("#del_frame").addEventListener("click", function (evt) { DelFrame() });
    // Se inicia la timeline
    init();
	CargarMultiSeleccion();
	CargarDrop();
})
let refDiv = null;
let refButton = null;
let refColor = null;
function pickerColor(that) {
    let bigDiv = document.createElement("div");
    bigDiv.style.width = "100%";
    bigDiv.style.height = "100%";
    bigDiv.style.top = "0";
    bigDiv.style.zIndex = "70";
    bigDiv.style.left = "0";
    bigDiv.style.opacity = "0";
    bigDiv.style.position = "absolute";
    bigDiv.id = "bigDiv"
    let container = document.createElement("div");
    container.style.border = "solid 1px black";
    container.style.backgroundColor = "white";
    container.style.boxShadow = "0 0 5px black";
    container.style.zIndex = "80";
    container.style.width = "100px";
    container.style.backgroundColor = "#343a40";
    container.style.fontWeight = "bold";
    container.style.color = "white"
    container.style.height = "80px";
    container.style.padding = "5px 10px";
    container.style.visibility = "hidden";
    container.innerHTML = "<div style='display:inline-block;height:32px;width:32px;border:solid 1px black'></div><p>#000000</p>";
    document.body.appendChild(container)
    document.body.appendChild(bigDiv)
    refDiv = container;
    refButton = that;
    document.onmousemove = seguirDiv;
}
function seguirDiv(evt) {
    let container = refDiv;
    container.style.position = "absolute";
    container.style.top = (evt.pageY + 10) + "px";
    container.style.left = (evt.pageX + 10) + "px";
    container.style.visibility = "visible";
    let mouse = robot.getMousePos()
    refColor = robot.getPixelColor(mouse.x, mouse.y)
    container.innerHTML = "<div style='display:inline-block;background-color:#" + refColor + ";height:32px;width:32px;border:solid 1px black'></div><p>#" + refColor + "</p>";
    document.onclick = ponerColor;
}
function ponerColor(evt) {
    refDiv.remove();
    var evento = new Event("input");
    document.onmousemove = null;
    document.onclick = null;
    let nameClass = ".elm." + refButton.className.replace("eyedropper ", "") + "_elm"
    document.querySelector(nameClass).value = "#" + refColor;
    document.querySelector(nameClass).dispatchEvent(evento);
    document.getElementById("bigDiv").remove();
    evt.stopPropagation();
}
let timelinegui;
function init() {
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext("2d");

    timelinegui = Timeline.getGlobalInstance();

	timelinegui.loop(-1); //loop forever
	timelinegui.stop();
}

function CargarMultiSeleccion() {
    document.getElementById("webview").onmousedown = SeleccionCuadrado;
}
function CargarDrop()
{
	const newLine = document.getElementById("outline");
	newLine.setAttribute("ondragover","Soltar(event)");
	newLine.setAttribute("ondrop","SoltarOutlineWeb(this,event)");
}
