let options = { "copyAnimationtoo": false }
let undoList = [];
let numUndo = -1;
let numRedo = -1;
let cambio = "";
let Zip = require("adm-zip");
let rutaArch = "";
const extra = require("fs-extra");
const path = require("path");
const {shell} = require("electron").remote

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
			document.querySelector("#outline ul").innerHTML = "";
			undoList = [];
			elmSeleccionado = null;
			document.querySelector("#libreria ul").innerHTML = "";
			if(extra.existsSync(app.getPath("temp")+"\\BlimpTemp"))
			{
				deleteFolderRecursive(app.getPath("temp")+"\\BlimpTemp")
				extra.mkdirSync(app.getPath("temp")+"\\BlimpTemp");
			}
			fich.extractAllTo(app.getPath("temp")+"\\BlimpTemp");
			let json = extra.readJsonSync(app.getPath("temp")+"\\BlimpTemp\\html.bl");
			document.querySelector("#webview").innerHTML = json.html;
			for(let obj of document.querySelectorAll("#webview *"))
			{
				obj.addEventListener("mousedown", function (evt) { ActivaInspector(obj, evt); });
				Creacion(obj);
				if(obj.nodeName == "IMG" || obj.nodeName == "AUDIO" || obj.nodeName == "VIDEO")
					annadirALibreria(obj);
			}
			rutaArch = project
			timelinegui.anims = [];
			timelinegui.loadFile(extra.readJsonSync(app.getPath("temp")+"\\BlimpTemp\\timeline.bl"));
			timelinegui.stop(endTimeline);
			//Read Medias and pass to local dir for edition
			let local_media = extra.readdirSync(app.getPath("temp")+"/BlimpTemp/img/client");
			for(let media of local_media)
			{
				extra.copySync(app.getPath("temp")+"/BlimpTemp/img/client/"+media,__dirname+"/img/client/"+media);
			}
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
		if(undoList[numUndo]["timeline"] != undefined)
		{
			let modificar = undoList[numUndo]["timeline"]["modifica"];
			if(modificar)
			{
				let arrTiempo = undoList[numUndo]["timeline"]["tiempos"];
				let endTime = 0;
				for(var a = 0;a < timelinegui.anims.length;a++)
				{
					if(arrTiempo.indexOf(timelinegui.anims[a]) != -1)
					{}
				}
			}else
			{
				let arrTiempo = undoList[numUndo]["timeline"]["tiempos"];
				let endTime = 0;
				endTimeline = 0;
				for(var a = 0;a < timelinegui.anims.length;a++)
				{
					if(arrTiempo.indexOf(timelinegui.anims[a]) != -1)
					{
						endTime = timelinegui.anims[a].startTime
						let id = timelinegui.anims[a].targetName.match(/#[a-z|0-9|\-|\_]+/g)[0];
						document.querySelector(id).setAttribute("termina",endTime);
						timelinegui.anims.splice(a,1);
						a--;
					}else
					{
						if(endTimeline < timelinegui.anims[a].endTime)
						{
							endTimeline = timelinegui.anims[a].endTime
						}
					}
				}
			}
		}else
		{
			for (let elm in jsonAnterior) {
				let id = jsonAnterior[elm]["@id"];
				let elemento = webview.querySelector("#" + id)
				if(elemento == undefined)
				{
					// Cuando no se encuentra el elemento en el webview
					let container = document.createElement(jsonAnterior[elm]["@node"]);
					elemento = container;
					let padre = jsonAnterior[elm]["@parentNode"];
					padre.appendChild(container);
					// Lo insertamos en el outline
					container.addEventListener("mousedown", function (evt) { ActivaInspector(container, evt); });
					Creacion(container);
				}
				for (let estilo in jsonAnterior[elm]) {
					if (estilo.indexOf("@") != -1) {
						elemento[estilo.replace("@", "")] = jsonAnterior[elm][estilo];
					} else {
						elemento.style[estilo] = jsonAnterior[elm][estilo];
					}
				}
			}
			for(let elm of document.querySelectorAll("#webview *"))
			{
				let res = false;
				for(let clave in jsonAnterior)
				{
					if(jsonAnterior[clave]["@id"] == elm.id)
						res = true
				}
				if(!res)
				{
					elm.remove();
					//Lo eliminamos de Outline
					let fullIdentificador = elm.nodeName.toLowerCase()+"#"+elm.id+"."+elm.className
					document.querySelector("#outline ul li[identificador='"+fullIdentificador+"']").remove();
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
function recordUndoTimeLine(modifica)
{
	let times = [];
	for(let i = timelinegui.anims.length-1;i > (timelinegui.anims.length-1)-15;i--)
	{
		times.push(timelinegui.anims[i]);
	}
	let json = {}
	if(modifica)
	{
		json.modifica = true
		json.tiempos = times;
	}else
	{
		json.modifica = false
		json.tiempos = times
	}
	undoList.push({timeline:json});
	numUndo = undoList.length - 1;
	numRedo = undoList.length - 1;
	numUndo = (numUndo<0)?0:numUndo;
	numRedo = (numRedo<0)?0:numRedo;
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
				if(estilo != "top" && estilo != "left" && estilo != "width" && estilo != "height" && estilo != "transform")
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
function Reproducir()
{
	try
	{
		extra.mkdirSync(app.getPath("temp")+"/tmpBuild/");
	}catch(ex){}
	let tempPath = app.getPath("temp")+"/tmpBuild/tmp-"+parseInt(Math.random()*100)+".html";
	Construir(tempPath)
	if(extra.existsSync(tempPath))
		shell.openExternal(tempPath);
}
function Construir(rutaPredefinida)
{
	if(document.querySelectorAll("#webview *").length > 0)
	{
		Build(rutaPredefinida);
	}
}
function Build(rutaPredefinida)
{
	let list_anims = timelinegui.anims;
	let css = "";
	let percentageTable = [];
	let numArr = [];
	let inicioPer = 0;
	let val = 0;
	let nombre = "";
	let end = 0;
	for(let keyframe of list_anims)
	{
		if(nombre != keyframe.targetName)
		{
			if(css.length>0)
			{
				for(let valor of numArr)
				{
					css += "\n"+valor+"% {\n"+percentageTable[valor].join("\n")+"}";
					percentageTable[valor] = [];
				}
				css += "}\n";
			}
				
			nombre = keyframe.targetName;
			css += "@keyframes "+nombre.replace("#","").replace(".","")+"{";
		}
		let comienza = keyframe["startTime"]
		let final = keyframe["endTime"]
		let endPerc = (final*100)/endTimeline;
		BuildCSS(endPerc,keyframe.propertyName,keyframe.endValue,keyframe.unit);
		end = final;
		inicioPer = (comienza*100)/endTimeline;
	}
	for(let valor of numArr)
	{
		css += "\n"+valor+"% {\n"+percentageTable[valor].join("\n")+"}";
		percentageTable[valor] = [];
	}
	css += "}\n";
	function BuildCSS(porcentaje,estilo,valor,unit)
	{
		if(numArr.indexOf(porcentaje.toFixed(2)) == -1)
			numArr.push(porcentaje.toFixed(2));
		if(percentageTable[porcentaje.toFixed(2)] == undefined)
			percentageTable[porcentaje.toFixed(2)] = [];
		percentageTable[porcentaje.toFixed(2)].push("\t"+estilo + ":" + ((unit==false||estilo.indexOf("color") != -1 ||estilo.indexOf("-shadow") != -1 ||estilo.indexOf("opacity") != -1 ||estilo.indexOf("z-index") != -1  || estilo.indexOf("transform") != -1 || valor.toString().indexOf("%") != -1 || estilo.indexOf("font-weight") != -1)?valor:valor+unit) +";"); 
	}

	//termina || dura
	let fotogramaCSS = css;

	css = "";
	for(let elm of document.querySelectorAll("#webview *"))
	{
		css += "#"+elm.id+"{\n";
		for(var a = 0;a < elm.style.length;a++)
		{
			let clave = elm.style[a];
			if(clave != "outline-color" && clave != "outline-style" && clave != "outline-width")
				css+= "\t"+clave+":"+elm.style[clave]+";\n";
		}
		let identificador = "div"+elm.id+elm.className
		css += "animation: "+identificador+" "+endTimeline+"s linear 0s infinite";
		css += "}\n"
	}
	let styleCss = css;

	let htmlCode = document.querySelector("#webview").innerHTML;
	var doc = document.createElement("div");
	doc.innerHTML = htmlCode;
	for(let obj of doc.querySelectorAll("*"))
	{
		obj.removeAttribute("style");
		obj.removeAttribute("termina");
		obj.removeAttribute("dura");
		obj.removeAttribute("draggable");
	}
	if(rutaPredefinida == undefined)
	{
			dialog.showSaveDialog(BrowserWindow.getAllWindows()[0],
			{
				"title": "Elija una ruta de exportación",
				"defaultPath": app.getPath("desktop"),
				"filters": [{
					name: 'Archivo de página Web',
					extensions: ['html']
				}
				]
			},function(pathFile)
			{
				let titulo = (rutaArch!="")?path.win32.basename(rutaArch):"WebProject";
				let htmlFile = "<html>\n\t<head>\n\t\t<title>"+titulo+"</title>\n\t\t<meta charset='utf-8' />\n\t\t<link rel='stylesheet' href='style.css' />\n\t</head>\n\t<body>"+doc.innerHTML+"\n\t</body>\n</html>"
				let rutaDirectorio = pathFile.replace(path.win32.basename(pathFile),"")
				extra.writeFileSync(pathFile,htmlFile,"utf-8");
				let cssFile = styleCss+fotogramaCSS;
				extra.writeFileSync(rutaDirectorio+"style.css",cssFile,"utf-8")
				try
				{
					extra.mkdirSync(rutaDirectorio+"img");
					extra.mkdirSync(rutaDirectorio+"img/client");
				}catch(ex){console.log("Directorios ya creados");}
				for(let media of libreria)
				{
					extra.copySync(media.replace("file:///",""),rutaDirectorio+"img/client/"+path.win32.basename(media));
				}
			})				
	}else
	{
		let titulo = (rutaArch!="")?path.win32.basename(rutaArch):"WebProject";
		let htmlFile = "<html>\n\t<head>\n\t\t<title>"+titulo+"</title>\n\t\t<meta charset='utf-8' />\n\t\t<link rel='stylesheet' href='style.css' />\n\t</head>\n\t<body>"+doc.innerHTML+"\n\t</body>\n</html>"
		let rutaDirectorio = rutaPredefinida.replace(path.win32.basename(rutaPredefinida),"")
		extra.writeFileSync(rutaPredefinida,htmlFile,"utf-8");
		let cssFile = styleCss+fotogramaCSS;
		extra.writeFileSync(rutaDirectorio+"style.css",cssFile,"utf-8")
		try
		{
			extra.mkdirSync(rutaDirectorio+"img");
			extra.mkdirSync(rutaDirectorio+"img/client");
		}catch(ex){console.log("Directorios ya creados");}
		for(let media of libreria)
		{
			extra.copySync(media.replace("file:///",""),rutaDirectorio+"img/client/"+path.win32.basename(media));
		}
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