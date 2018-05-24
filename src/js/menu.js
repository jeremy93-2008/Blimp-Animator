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
const defaultAnimOption = 
{
	"timing-function":"linear",
	"delay":0,
	"iteration-count":"infinite",
	"direction":"normal",
	"fill-mode":"none",
	"moreCode":""
};
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
	if(localStorage.animation != undefined && localStorage.animation != "")
		extra.writeJsonSync(app.getPath("temp")+"\\BlimpTemp\\animationConfig.bl",localStorage.animation);
	if(localStorage.resolFrame != undefined && localStorage.resolFrame != "" && localStorage.resolFrame != "null")
		extra.writeJsonSync(app.getPath("temp")+"\\BlimpTemp\\resolFrame.bl",localStorage.resolFrame);
	if(localStorage.cssCode != undefined && localStorage.cssCode != "" && localStorage.cssCode != "null")
		extra.writeJsonSync(app.getPath("temp")+"\\BlimpTemp\\code.bl",localStorage.cssCode);
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
				document.title = path.win32.basename(rutaArch)+" - Blimp Animator"
			})		
	}else
	{
		comprimido.writeZip(rutaArch);
		document.title = path.win32.basename(rutaArch)+" - Blimp Animator"
	}
	
}
function AbrirArchivo()
{
	localStorage.animation = "";
	document.title = document.title.replace("*","")
	dialog.showOpenDialog(BrowserWindow.getAllWindows()[0],
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
			AbrirBlimp(pathFiles, deleteFolderRecursive);
		});
}
function AbrirArchivoDefinido(pathFile)
{
	let arr = [pathFile];
	AbrirBlimp(arr,deleteFolderRecursive);
}
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
function AbrirBlimp(pathFiles, deleteFolderRecursive) {
	let project = pathFiles[0];
	let fich = new Zip(project);
	document.querySelector("#outline ul").innerHTML = "";
	undoList = [];
	elmSeleccionado = null;
	document.querySelector("#libreria ul").innerHTML = "";
	if (extra.existsSync(app.getPath("temp") + "\\BlimpTemp")) {
		deleteFolderRecursive(app.getPath("temp") + "\\BlimpTemp");
		extra.mkdirSync(app.getPath("temp") + "\\BlimpTemp");
	}
	fich.extractAllTo(app.getPath("temp") + "\\BlimpTemp");
	let json = extra.readJsonSync(app.getPath("temp") + "\\BlimpTemp\\html.bl");
	document.querySelector("#webview").innerHTML = json.html;
	endTimeline = 0;
	for (let obj of document.querySelectorAll("#webview *")) {
		obj.style.outline = "";
		let identificador = obj.parentNode.nodeName.toLowerCase()+"#"+obj.parentNode.id+"."+obj.parentNode.className
		let elm = document.querySelector("#outline ul li[identificador='"+identificador+"']")
		if(elm != undefined)
			elm = document.querySelector("#"+obj.parentNode.id)
		if(elm==undefined)
			elmSeleccionado = null;
		else
			elmSeleccionado = elm;
		if (parseFloat(obj.getAttribute("termina")) > endTimeline)
			endTimeline = parseFloat(obj.getAttribute("termina"));
		obj.addEventListener("mousedown", function (evt) { ActivaInspector(obj, evt); });
		Creacion(obj);
		if (obj.nodeName == "IMG" || obj.nodeName == "AUDIO" || obj.nodeName == "VIDEO")
			annadirALibreria(obj);
	}
	rutaArch = project;
	try {
		localStorage.animation = extra.readJsonSync(app.getPath("temp") + "\\BlimpTemp\\animationConfig.bl");
	}
	catch (ex) { }
	try {
		localStorage.resolFrame = extra.readJsonSync(app.getPath("temp") + "\\BlimpTemp\\resolFrame.bl");
		let tabla = localStorage.resolFrame.split(";");
		FrameDefault(tabla[0], tabla[1]);
	}
	catch (ex) { }
	try
	{
		localStorage.cssCode = extra.readJsonSync(app.getPath("temp") + "\\BlimpTemp\\code.bl");
	}catch(ex){}
	timelinegui.anims = [];
	timelinegui.loadFile(extra.readJsonSync(app.getPath("temp") + "\\BlimpTemp\\timeline.bl"));
	timelinegui.stop(endTimeline);
	//Read Medias and pass to local dir for edition
	let local_media = extra.readdirSync(app.getPath("temp") + "/BlimpTemp/img/client");
	for (let media of local_media) {
		extra.copySync(app.getPath("temp") + "/BlimpTemp/img/client/" + media, __dirname + "/img/client/" + media);
	}
	document.title = path.win32.basename(rutaArch) + " - Blimp Animator";
}

function Deshacer() {
	if(endTimeline == timelinegui.time && !timelinegui.playing)
	{
		let jsonAnterior = undoList[numUndo];
		const webview = document.querySelector("#webview")
		if(undoList[numUndo]["timeline"] != undefined)
		{
			endTimeline = 0;
			let modificar = undoList[numUndo]["timeline"]["modifica"];
			if(modificar)
			{
				let arrTiempo = undoList[numUndo]["timeline"]["tiempos"];
				let endTime = 0;
				for(var a = 0;a < timelinegui.anims.length;a++)
				{
					if(arrTiempo.indexOf(timelinegui.anims[a]) != -1)
					{
						timelinegui.anims[a] = arrTiempo[a]
						if(endTimeline < timelinegui.anims[a].endTime)
						{
							endTimeline = timelinegui.anims[a].endTime
						}
					}
				}
			}else
			{
				let arrTiempo = undoList[numUndo]["timeline"]["tiempos"];
				let endTime = 0;
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
					container.id = jsonAnterior[elm]["@id"]
					container.className = jsonAnterior[elm]["@class"]
					elemento = container;
					let padre = jsonAnterior[elm]["@parentNode"];
					padre.appendChild(container);
					// Lo insertamos en el outline
					container.addEventListener("mousedown", function (evt) { ActivaInspector(container, evt); });
					Creacion(container);
					// Reasignamos las timeline quepodia tener en referencia
					let identificador = container.nodeName.toLowerCase()+"#"+container.id+"."+container.className;
					for(let a = 0;a < timelinegui.anims.length;a++)
					{
						if(timelinegui.anims[a].targetName == identificador)
							timelinegui.anims[a].target = container.style;
					}
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
		if(undoList[numUndo]["timeline"] != undefined)
			numRedo--;
		numUndo--;
		numUndo = (numUndo > 0) ? numUndo : 0
		numRedo = (numRedo > 0) ? numRedo : 1
	}
}
function Rehacer() {
	if(endTimeline == timelinegui.time && !timelinegui.playing)
	{
		if(undoList[numRedo]["timeline"] != undefined)
		{
			endTimeline = 0;
			let modificar = undoList[numRedo]["timeline"]["modifica"];
			if(modificar)
			{
				let arrTiempo = undoList[numRedo]["timeline"]["tiempos"];
				let endTime = 0;
				for(var a = 0;a < timelinegui.anims.length;a++)
				{
					if(arrTiempo.indexOf(timelinegui.anims[a]) != -1)
					{
						timelinegui.anims[a] = arrTiempo[a]
					}
					if(endTimeline < timelinegui.anims[a].endTime)
					{
						endTimeline = timelinegui.anims[a].endTime
					}
				}
			}else
			{
				let arrTiempo = undoList[numRedo]["timeline"]["tiempos"];
				let endTime = 0;
				for(var a = 0;a < arrTiempo.length;a++)
				{
					endTime = arrTiempo[a].startTime
					let id = arrTiempo[a].targetName.match(/#[a-z|0-9|\-|\_]+/g)[0];
					document.querySelector(id).setAttribute("termina",endTime);
					timelinegui.anims.push(arrTiempo[a]);
					if(endTimeline < arrTiempo[a].endTime)
					{
						endTimeline = arrTiempo[a].endTime
					}
				}
			}
			timelinegui.stop(endTimeline);
		}
		else
		{
			let jsonAnterior = undoList[numRedo];
			const webview = document.querySelector("#webview")
			for (let elm in jsonAnterior) {
				let id = jsonAnterior[elm]["@id"];
				let elemento = webview.querySelector("#" + id)
				if(elemento == undefined)
				{
					// Cuando no se encuentra el elemento en el webview
					let container = document.createElement(jsonAnterior[elm]["@node"]);
					container.id = jsonAnterior[elm]["@id"]
					container.className = jsonAnterior[elm]["@class"]
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
		numUndo = numRedo - 1;
		if(undoList[numRedo]["timeline"] != undefined)
			numUndo--;
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
	if(numUndo > 0 && numUndo < (undoList.length-1))
	{
		let cantidad = (undoList.length-1)-numUndo
		undoList.splice(numUndo,cantidad);
	}
	undoList.push({timeline:json});

	numUndo = undoList.length - 1;
	numRedo = undoList.length - 1;
	numUndo = (numUndo<0)?0:numUndo;
	numRedo = (numRedo<0)?0:numRedo;
	if(document.title.indexOf("●") == -1)
		document.title = "● "+document.title;
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
		if(document.title.indexOf("●") == -1)
		document.title = "● "+document.title;
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
function CompararId(name,name2)
{
	if(name.targetName < name2.targetName)
	{
		return 1
	}else if(name.targetName > name2.targetName)
	{
		return -1
	}else
	{
		return 0;
	}
}
function Construir(rutaPredefinida)
{
	if(document.querySelectorAll("#webview *").length > 0)
	{
		Build(rutaPredefinida);
	}
}
function MakeAnimationFromTimeline()
{
	let tabla = [];
	for(let clave in timelinegui.anims)
	{
		tabla[clave] = timelinegui.anims[clave]
	}
	return tabla;
}
function Build(rutaPredefinida)
{
	let list_anims = MakeAnimationFromTimeline().sort(CompararId);
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
		let idOfAnim = elm.nodeName.toLowerCase()+"#"+elm.id+"."+elm.className
		let identificador = "div"+elm.id+elm.className
		if(localStorage.animation != undefined && localStorage.animation != "")
		{
			let local = JSON.parse(localStorage.animation);
			if(local[idOfAnim] != undefined)
			{
				css+= "\tanimation-name:"+identificador+";\n"
				css+= "\tanimation-duration:"+endTimeline+"s;\n"
				css+= "\tanimation-timing-function:"+local[idOfAnim]["timing-function"]+";\n"
				css+= "\tanimation-delay:"+local[idOfAnim]["delay"]+"s;\n"
				css+= "\tanimation-iteration-count:"+local[idOfAnim]["iteration-count"]+";\n"
				css+= "\tanimation-direction:"+local[idOfAnim]["direction"]+";\n"
				css+= "\tanimation-fill-mode:"+local[idOfAnim]["fill-mode"]+";"
			}else
			{
				css += "\tanimation: "+identificador+" "+endTimeline+"s linear 0s infinite";
			}
		}else
		{
			css += "\tanimation: "+identificador+" "+endTimeline+"s linear 0s infinite";
		}
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
	if(rutaPredefinida == undefined || typeof(rutaPredefinida) != "string")
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
				let code = (localStorage.cssCode == undefined || localStorage.cssCode == "")?"":localStorage.cssCode;
				let cssFile =styleCss+fotogramaCSS+ code+"\n";
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
		let code = (localStorage.cssCode == undefined || localStorage.cssCode == "")?"":localStorage.cssCode;
		let cssFile = styleCss+fotogramaCSS+code+"\n";
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
function CambiarPanel(name)
{
	var evento = new Event("click");
	document.querySelector(".inspector_menu #btn-"+name).dispatchEvent(evento);
}
function Ventana(state)
{
	if(state == "min")
		BrowserWindow.getAllWindows()[0].minimize();
	else if(state == "max")
		BrowserWindow.getAllWindows()[0].maximize();
	else if(state == "full")
		BrowserWindow.getAllWindows()[0].setFullScreen((BrowserWindow.getAllWindows()[0].isFullScreen())?false:true);
}
function Ayuda()
{
	
}
function BuscarActualizaciones()
{
	
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
function SetTamanio()
{
	if(localStorage.resolFrame == undefined || localStorage.resolFrame == "")
		localStorage.resolFrame = "1024;320"
	let CodeWindow = new BrowserWindow(
		{
			width: 320,
			height: 200,
			minWidth: 320,
			minHeight: 200,
			modal: true,
			title: "Editar Resolución de Trabajo",
			icon: "img/logo-32.png",
			resizable: false,
			minimizable: false,
			parent: BrowserWindow.getAllWindows()[0],
			backgroundColor: "#333",
			nativeWindowOpen: true
		})
	CodeWindow.loadURL(path.join(__dirname, "/setSize.html"))
	CodeWindow.setMenu(null);
	CodeWindow.on('closed', function () 
	{
		if(localStorage.resolFrame != "null")
		{
			let tabla = localStorage.resolFrame.split(";")
			document.querySelector("#webview").style.width = tabla[0]+"px"
			document.querySelector("#webview").style.height = tabla[1]+"px"
			document.querySelector("#resolucion").innerHTML = "w:"+tabla[0]+"px"+" h:"+tabla[1]+"px";
		}
	});
}
function Opciones(opt)
{
	if(opt == "animation")
	{
		let elm = "";
		document.querySelectorAll("#webview *").forEach(function(el)
		{
			elm += el.nodeName.toLowerCase()+"#"+el.id+"."+el.className+";";
		});
		localStorage.eachElm = elm;
		localStorage.option = "animation";
		let CodeWindow = new BrowserWindow(
		{
			width: 740,
			height: 540,
			minWidth: 740,
			minHeight: 540,
			modal: true,
			title: "Opciones de Construcción",
			icon: "img/logo-32.png",
			resizable: false,
			minimizable: false,
			parent: BrowserWindow.getAllWindows()[0],
			backgroundColor: "#333",
			nativeWindowOpen: true
		})
	CodeWindow.loadURL(path.join(__dirname, "/buildOption.html"))
	CodeWindow.setMenu(null);
	CodeWindow.on("closed",function()
	{
		AplicarOpciones();
	})
	}else
	{
		let elm = "";
		document.querySelectorAll("#webview *").forEach(function(el)
		{
			elm += el.nodeName.toLowerCase()+"#"+el.id+"."+el.className+";";
		});
		localStorage.eachElm = elm;
		localStorage.option = "general";
		let CodeWindow = new BrowserWindow(
		{
			width: 740,
			height: 540,
			minWidth: 740,
			minHeight: 540,
			modal: true,
			title: "Preferencias",
			icon: "img/logo-32.png",
			resizable: false,
			minimizable: false,
			parent: BrowserWindow.getAllWindows()[0],
			backgroundColor: "#333",
			nativeWindowOpen: true
		})
		CodeWindow.loadURL(path.join(__dirname, "/buildOption.html"))
		CodeWindow.setMenu(null);
		CodeWindow.on("closed",function()
		{
			AplicarOpciones();
		})
	}
}
function AplicarOpciones()
{
	let guia = localStorage.guiaLienzo
	if(guia == "true")
	{
		document.querySelector("#renderer").style.backgroundSize = "45px 45px";
		document.querySelector("#renderer").style.backgroundImage = "linear-gradient(to right, #ddd 1px, transparent 1px)";
	}else
	{
		document.querySelector("#renderer").style.backgroundSize = "none";
		document.querySelector("#renderer").style.backgroundImage = "none";
	}
	ChangeColorinTimeline();
	location.refresh();
}
var request = require('request');
function BuscarActualizaciones()
{
	let client = request("http://www.alva-interactive.com.es/blimp/version.txt",function(error,response,body)
	{
		let txtVersion = Number(response.body.replace(".",""))
		let currentVersion = Number(remote.app.getVersion().replace(".",""));
		if(txtVersion > currentVersion)
			MessageBox("Blimp Animator","Se ha encontrado una versión más reciente disponible. ¿Desea descargarla?.","warning",["OK","Cancelar"],function(x)
			{
				if(x==0)
				{
					let install = request("http://www.alva-interactive.com.es/blimp/installer.exe",function(error,response,body)
					{
						const process = require('child_process');   
						var ls = process.exec(app.getPath("temp")+"\\inst.exe");	
					}).pipe(extra.createWriteStream(app.getPath("temp")+"\\inst.exe"))
				}
					
			});
		else
			MessageBox("Blimp Animator","Actualmente, no hay actualizaciones disponibles.","info",["OK"],function(){});
	});
}
function Cerrar()
{
	window.close();
}