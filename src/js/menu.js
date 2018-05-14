let options = {"copyAnimationtoo":false}
function Deshacer()
{
	// Crear uno propio
}
function Rehacer()
{

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