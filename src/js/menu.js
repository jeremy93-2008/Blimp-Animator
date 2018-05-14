let options = {"copyAnimationtoo":false}
let undoList = [];
let numUndo = 0;
let numRedo = 0;
let cambio = "";
function Deshacer()
{
	let jsonAnterior = undoList[numUndo];
	const webview = document.querySelector("#webview")
	for(let elm in jsonAnterior)
	{
		let id = jsonAnterior[elm]["@id"];
		let elemento = webview.querySelector("#"+id)
		if(elemento == null)
		{
			elemento = document.createElement(jsonAnterior[elm]["@node"]);
			webview.appendChild(elemento);
		}
		for(let estilo in jsonAnterior[elm])
		{
			if(estilo.indexOf("@") != -1)
			{
				elemento[estilo.replace("@","")] = jsonAnterior[elm][estilo];
			}else
			{
				elemento.style[estilo] =  jsonAnterior[elm][estilo];
			}
		}		
	}
	for(let html of webview.querySelectorAll("*"))
	{
		if(jsonAnterior[html.id] == null)
		{
			html.remove();
		}
	}
	numRedo = numUndo+1;
	numUndo--;
	numUndo = (numUndo>0)?numUndo:0
	numRedo = (numRedo>0)?numRedo:1
}
function Rehacer()
{
	let jsonAnterior = undoList[numRedo];
	const webview = document.querySelector("#webview")
	for(let elm in jsonAnterior)
	{
		let id = jsonAnterior[elm]["@id"];
		let elemento = webview.querySelector("#"+id)
		if(elemento == null)
		{
			elemento = document.createElement(jsonAnterior[elm]["@node"]);
			webview.appendChild(elemento);
		}
		for(let estilo in jsonAnterior[elm])
		{
			if(estilo.indexOf("@") != -1)
			{
				elemento[estilo.replace("@","")] = jsonAnterior[elm][estilo];
			}else
			{
				elemento.style[estilo] =  jsonAnterior[elm][estilo];
			}
		}		
	}
	for(let html of webview.querySelectorAll("*"))
	{
		if(jsonAnterior[html.id] == null)
		{
			html.remove();
		}
	}
	numUndo = numRedo-1;
	numRedo++;
	numUndo = (numUndo>undoList.length-1)?undoList.length-2:numUndo
	numRedo = (numRedo>undoList.length-1)?undoList.length-1:numRedo
}
function recordUndo()
{
	// Crear uno propio
	const webview = document.querySelectorAll("#webview *")
	let json = {};
	for(let elm of webview)
	{
		let tabla = {};
		tabla["@id"] = elm.id;
		tabla["@class"] = elm.className;
		tabla["@src"] = elm.src;
		tabla["@node"] = elm.nodeName;
		for(let estilo of elm.style)
		{
			tabla[estilo] = (elm.style[estilo]);
		}
		json[elm.id] = tabla;
	}
	undoList.push(json);
	numUndo = undoList.length-2;
	numRedo = undoList.length-1;
}
function Cortar()
{
	if(elmSeleccionado != null)
	{
		let id_for_elm = elmSeleccionado.nodeName.toLowerCase()+"#"+elmSeleccionado.id+"."+elmSeleccionado.className;

		let hadAnimation = false;
		for(let obj of timelinegui.anims)
			if(id_for_elm == obj.targetName)
				hadAnimation = true
		if(hadAnimation && options["copyAnimationtoo"])
		{

		}
		let elm = elmSeleccionado.cloneNode(true);
		clipboard.writeHTML(elm.outerHTML);
		elmSeleccionado.remove();
	}
}
function Copiar()
{
	if(elmSeleccionado != null)
	{
		let id_for_elm = elmSeleccionado.nodeName.toLowerCase()+"#"+elmSeleccionado.id+"."+elmSeleccionado.className;

		let hadAnimation = false;
		for(let obj of timelinegui.anims)
			if(id_for_elm == obj.targetName)
				hadAnimation = true
		if(hadAnimation && options["copyAnimationtoo"])
		{
			
		}
		let elm = elmSeleccionado.cloneNode(true);
		clipboard.writeHTML(elm.outerHTML);
	}
}
function PegarSoloEstilo()
{
	if(elmSeleccionado != null)
	{
		let html = clipboard.readHTML();
		let div = document.createElement("div");
		if(html.trim() != "" && html != null)
		{
			div.innerHTML = html;
			let lista = div.firstChild.style;
			elmSeleccionado.style = lista;
			//NOT WORKING
		}
	}
}
function Pegar()
{
	let html = clipboard.readHTML();
	let div = document.createElement("div");
	if(html.trim() != "" && html != null)
	{
		div.innerHTML = html;
		
		let id = div.firstChild.id
		let num = 0;
		while(document.querySelector("#"+id) != undefined)
		{
			id += "-copy"+num;
			num++;
		}
		div.firstChild.id = id;
		div.firstChild.style.top = "0px";
		div.firstChild.style.left = "0px";
		InspectorEsconder(false);
		document.querySelector("#webview").appendChild(div.firstChild);
		let newElm = document.querySelector("#"+id);
		newElm.addEventListener("click",function(evt){ActivaInspector(newElm,evt);});
		Creacion(newElm);
	}
}
function Licencia()
{
	let CodeWindow = new BrowserWindow(
        {
            width: 480,
            height: 320,
            minWidth: 480,
            minHeight: 320,
            modal: true,
            title: "Ver Licencia",
            icon: "img/logo-32.png",
            resizable: false,
            minimizable: false,
            parent: BrowserWindow.getAllWindows()[0],
            backgroundColor: "#333",
            nativeWindowOpen: true
        })
    CodeWindow.loadURL(path.join(__dirname, "/license.html"))
    CodeWindow.setMenu(null);
}
function Acerca()
{
	let CodeWindow = new BrowserWindow(
        {
            width: 480,
            height: 320,
            minWidth: 480,
            minHeight: 320,
            modal: true,
            title: "Acerca de",
            icon: "img/logo-32.png",
            resizable: false,
            minimizable: false,
            parent: BrowserWindow.getAllWindows()[0],
            backgroundColor: "#333",
            nativeWindowOpen: true
        })
    CodeWindow.loadURL(path.join(__dirname, "/about.html"))
	CodeWindow.setMenu(null);
}