let options = { "copyAnimationtoo": false }
let undoList = [];
let numUndo = -1;
let numRedo = -1;
let cambio = "";
let Zip = require("adm-zip");
let rutaArch = "";
const extra = require("fs-extra");
const path = require("path");

function Guardar(verDialogo)
{
	let lista_incluido = [];
	let html = document.querySelector("#webview").innerHTML;
	let timeline = timelinegui.save();
	if(extra.existsSync(app.getPath("temp")+"\\BlimpTemp\\img\\client"))
	{
		let lista = extra.readdirSync(app.getPath("temp")+"\\BlimpTemp\\img\\client");
		for(let obj of lista)
		{
			extra.removeSync(app.getPath("temp")+"\\BlimpTemp\\img\\client\\"+obj);
		}
	}
	try
	{
		extra.mkdirSync(app.getPath("temp")+"\\BlimpTemp");
		if(extra.existsSync(app.getPath("temp")+"\\BlimpTemp"))
		{
			extra.mkdirSync(app.getPath("temp")+"\\BlimpTemp\\img");
			if(extra.existsSync(app.getPath("temp")+"\\BlimpTemp\\img"))
			{
				extra.mkdirSync(app.getPath("temp")+"\\BlimpTemp\\img\\client");
			}
		}
		
	}catch(ex){}
	extra.writeJsonSync(app.getPath("temp")+"\\BlimpTemp\\html.bl",{"html":html});
	lista_incluido.push(app.getPath("temp")+"\\BlimpTemp\\html.bl");
	extra.writeJsonSync(app.getPath("temp")+"\\BlimpTemp\\timeline.bl",timeline);
	lista_incluido.push(app.getPath("temp")+"\\BlimpTemp\\timeline.bl");
	for(let media of libreria)
	{
		extra.copySync(media.replace("file:///",""),app.getPath("temp")+"\\BlimpTemp\\img\\client\\"+path.win32.basename(media));
		lista_incluido.push(app.getPath("temp")+"\\BlimpTemp\\img\\client\\"+path.win32.basename(media));
	}
	let comprimido = new Zip();
	comprimido.addLocalFolder(app.getPath("temp")+"\\BlimpTemp");
	if(rutaArch == "" || verDialogo == true)
	{
		dialog.showSaveDialog(BrowserWindow.getAllWindows()[0],
			{
				"title": "Elija una ruta de guardado",
				"defaultPath": app.getPath("desktop"),
				"filters": [{
					name: 'Archivos de guardado Blimp',
					extensions: ['blimp']
				}
				]
			},function(pathFile)
			{
				comprimido.writeZip(pathFile);
				rutaArch = pathFile;
			})		
	}else
	{
		comprimido.writeZip(rutaArch);
	}
	
}
function AbrirArchivo()
{
	dialog.showOpenDialog(
		{
			"title": "Elija un proyecto BLIMP",
			"defaultPath": app.getPath("desktop"),
			"filters": [{
				name: 'Archivos BLIMP',
				extensions: ['blimp']
			}
			],
			"properties": ["openFile"]
		}, function (pathFiles) {
			let project = pathFiles[0];
			let fich = new Zip(project);
			if(extra.existsSync(app.getPath("temp")+"\\BlimpTemp"))
			{
				deleteFolderRecursive(app.getPath("temp")+"\\BlimpTemp")
				extra.mkdirSync(app.getPath("temp")+"\\BlimpTemp");
			}
			fich.extractAllTo(app.getPath("temp")+"\\BlimpTemp");
			let json = extra.readJsonSync(app.getPath("temp")+"\\BlimpTemp\\html.bl");
			document.querySelector("#webview").innerHTML = json.html;
			timelinegui.loadFile(extra.readJsonSync(app.getPath("temp")+"\\BlimpTemp\\timeline.bl"));
			//Read Medias and pass to local dir for edition
		});
		function deleteFolderRecursive(path) {
			if (extra.existsSync(path)) {
			  extra.readdirSync(path).forEach(function(file, index){
				var curPath = path + "/" + file;
				if (extra.lstatSync(curPath).isDirectory()) { // recurse
				  deleteFolderRecursive(curPath);
				} else { // delete file
				  extra.unlinkSync(curPath);
				}
			  });
			  extra.rmdirSync(path);
			}
		  };
}
function Deshacer() {
	if(endTimeline == timelinegui.time && !timelinegui.playing)
	{
		let jsonAnterior = undoList[numUndo];
		const webview = document.querySelector("#webview")
		for (let elm in jsonAnterior) {
			let id = jsonAnterior[elm]["@id"];
			let elemento = webview.querySelector("#" + id)
			for (let estilo in jsonAnterior[elm]) {
				if (estilo.indexOf("@") != -1) {
					elemento[estilo.replace("@", "")] = jsonAnterior[elm][estilo];
				} else {
					elemento.style[estilo] = jsonAnterior[elm][estilo];
				}
			}
		}
		numRedo = numUndo + 1;
		numUndo--;
		numUndo = (numUndo > 0) ? numUndo : 0
		numRedo = (numRedo > 0) ? numRedo : 1
	}
}
function Rehacer() {
	if(endTimeline == timelinegui.time && !timelinegui.playing)
	{
		let jsonAnterior = undoList[numRedo];
		const webview = document.querySelector("#webview")
		for (let elm in jsonAnterior) {
			let id = jsonAnterior[elm]["@id"];
			let elemento = webview.querySelector("#" + id)
			for (let estilo in jsonAnterior[elm]) {
				if (estilo.indexOf("@") != -1) {
					elemento[estilo.replace("@", "")] = jsonAnterior[elm][estilo];
				} else {
					elemento.style[estilo] = jsonAnterior[elm][estilo];
				}
			}
		}
		numUndo = numRedo - 1;
		numRedo++;
		numUndo = (numUndo > undoList.length - 1) ? undoList.length - 2 : numUndo
		numRedo = (numRedo > undoList.length - 1) ? undoList.length - 1 : numRedo
	}
}
function recordUndo() {
	if(endTimeline == timelinegui.time && !timelinegui.playing)
	{
		// Crear uno propio
		const webview = document.querySelectorAll("#webview *")
		let json = {};
		for (let elm of webview) {
			let tabla = {};
			tabla["@id"] = elm.id;
			tabla["@class"] = elm.className;
			tabla["@src"] = elm.src;
			tabla["@node"] = elm.nodeName;
			tabla["@parentNode"] = elm.parentNode;
			for (let estilo of elm.style) {
				tabla[estilo] = (elm.style[estilo]);
			}
			json[elm.id] = tabla;
		}
		undoList.push(json);
		numUndo = undoList.length - 2;
		numRedo = undoList.length - 1;
		numUndo = (numUndo<0)?0:numUndo;
		numRedo = (numRedo<0)?0:numRedo;
	}
}
function Cortar() {
	if (elmSeleccionado != null) {
		let id_for_elm = elmSeleccionado.nodeName.toLowerCase() + "#" + elmSeleccionado.id + "." + elmSeleccionado.className;

		let hadAnimation = false;
		for (let obj of timelinegui.anims)
			if (id_for_elm == obj.targetName)
				hadAnimation = true
		if (hadAnimation && options["copyAnimationtoo"]) {

		}
		let elm = elmSeleccionado.cloneNode(true);
		clipboard.writeHTML(elm.outerHTML);
		elmSeleccionado.remove();
	}
}
function Copiar() {
	if (elmSeleccionado != null) {
		let id_for_elm = elmSeleccionado.nodeName.toLowerCase() + "#" + elmSeleccionado.id + "." + elmSeleccionado.className;

		let hadAnimation = false;
		for (let obj of timelinegui.anims)
			if (id_for_elm == obj.targetName)
				hadAnimation = true
		if (hadAnimation && options["copyAnimationtoo"]) {

		}
		let elm = elmSeleccionado.cloneNode(true);
		clipboard.writeHTML(elm.outerHTML);
	}
}
function PegarSoloEstilo() {
	if (elmSeleccionado != null) {
		let elmS = elmSeleccionado
		if(Array.isArray(elmS))
			elmS = elmSeleccionado[0];
		let html = clipboard.readHTML();
		let div = document.createElement("div");
		if (html.trim() != "" && html != null) {
			div.innerHTML = html;
			let lista = div.firstChild.style;
			for(let estilo of lista)
			{
				if(estilo != "top" && estilo != "left" && estilo != "width" && estilo != "height")
					elmS.style[estilo] = lista[estilo];
			}
		}
	}
}
function Pegar() {
	let html = clipboard.readHTML();
	let div = document.createElement("div");
	if (html.trim() != "" && html != null) {
		div.innerHTML = html;

		let id = div.firstChild.id
		let num = 0;
		while (document.querySelector("#" + id) != undefined) {
			id += "-copy" + num;
			num++;
		}
		div.firstChild.id = id;
		div.firstChild.style.top = "0px";
		div.firstChild.style.left = "0px";
		InspectorEsconder(false);
		document.querySelector("#webview").appendChild(div.firstChild);
		let newElm = document.querySelector("#" + id);
		newElm.addEventListener("click", function (evt) { ActivaInspector(newElm, evt); });
		Creacion(newElm);
	}
}
function Licencia() {
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
function Acerca() {
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