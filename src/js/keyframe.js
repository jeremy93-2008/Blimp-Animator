var numFrame = 0;
var duration = 0;
var totalDuration = 0;
var beginTo = 0;
var supressKeyFrame = false;
var infoDel = "";
var elmSeleccionado = null;
var endTimeline = 0;
var txtStyle = ["z-index","top","left","width","height","background-color","border-color","border-radius","font-size","color","font-weight","box-shadow","text-shadow","opacity","transform"];
function AnnadirFrame()
{
  if(elmSeleccionado!=null)
  {
    // Recuperamos el puntero hacia el elemento DOM
    const webview = document.querySelector("#webview");
		localStorage.habilitarBegin = "true"

		if(Array.isArray(elmSeleccionado))
		{
			let html = "";
			for(let obj of elmSeleccionado)
			{
				html += obj.nodeName.toLowerCase()+"#"+obj.id+"."+obj.className+"<br>";
			}
			beginTo = parseFloat((elmSeleccionado[elmSeleccionado.length-1].getAttribute("termina")==undefined?0:elmSeleccionado[elmSeleccionado.length-1].getAttribute("termina")))
			duration = parseFloat((elmSeleccionado[elmSeleccionado.length-1].getAttribute("dura")==undefined)?0:1)
			localStorage.timeFrame = beginTo+";"+duration+";"+ html;
		}else
		{
			beginTo = parseFloat((elmSeleccionado.getAttribute("termina")==undefined?0:elmSeleccionado.getAttribute("termina")))
			duration = parseFloat((elmSeleccionado.getAttribute("dura")==undefined)?0:1)
			localStorage.timeFrame = beginTo+";"+duration+";"+ elmSeleccionado.nodeName.toLowerCase()+"#"+elmSeleccionado.id+"."+elmSeleccionado.className;
		}
    
    let AddWindow = new BrowserWindow(
      {
        width: 380,
        height: 240,
        minWidth: 380,
        minHeight: 240,
        modal:true,
        icon:"img/logo-32.png",
        resizable:false,
        minimizable:false,
        parent:BrowserWindow.getAllWindows()[0],
				backgroundColor: "#333",
				title:"Añadir fotograma clave",
        nativeWindowOpen: true,
      })
    AddWindow.loadURL(path.join(__dirname,"/newFrame.html"))
    AddWindow.setMenu(null);
    AddWindow.on('closed', function () {
      if(localStorage.timeFrame != "null")
      {
        // Recuperamos las variables
        var arr = localStorage.timeFrame.split(";");
        beginTo = parseFloat(arr[0]);
		duration = parseFloat(arr[1]);
        // Guardamos el estado del frame actual
        if(webview.innerHTML.trim() != "")
        {
          // Grabamos el objeto seleccionado en su movimiento
					el = elmSeleccionado;
					if(Array.isArray(elmSeleccionado))
					{
						for(let obj of elmSeleccionado)
						{
							let identificador = "div#"+obj.id+"."+obj.className;
							let json = {};
							for(let prop of txtStyle)
							{
								let valor = obj.style[prop];
									if(prop == "opacity")
										json[prop] = (prop!="opacity")?valor:(valor=="")?1:valor;
									else if(prop == "transform")
										json[prop] = (valor=="")?"rotate(0deg)":valor;
									else if(prop == "height")
										json[prop] = (valor=="")?devolverNumeroTexto(obj,prop):Number(valor.replace("px",""));
									else if(valor == "black")
										json[prop] = "rgb(0,0,0)";
									else if(valor == "" && prop.indexOf("-shadow") != -1)
										json[prop] = "black 0px 0px 0px";
									else if(valor != "" && prop.indexOf("-shadow") != -1)
										json[prop] = valor;
									else if(valor == "" && prop == "z-index")
										json[prop] = 0;
									else if(valor == "" && prop == "font-weight")
										json[prop] = 400;                
									else if(valor == "")
										json[prop] = devolverNumeroTexto(obj,prop);
									else if(valor.indexOf("px") != -1)
										json[prop] = Number(valor.replace("px",""));
									else
										json[prop] = valor;
							}
							//Añadimos este frame como clave
							anim(identificador,obj.style,timelinegui).to(beginTo,json,duration);
							// Sumamos uno al contador de Frame
							numFrame++;
							obj.setAttribute("termina",parseFloat(arr[0]) + parseFloat(arr[1]));
							obj.setAttribute("dura","true");
						}
						// Ponemos el timeline en pausa
						beginTo = parseFloat(arr[0]) + parseFloat(arr[1]);
						if(beginTo>endTimeline)
							endTimeline = beginTo 
						timelinegui.stop(endTimeline);
					}else
					{
						let obj = el;
						let identificador = "div#"+obj.id+"."+obj.className;
						let json = {};
						for(let prop of txtStyle)
						{
							let valor = obj.style[prop];
								if(prop == "opacity")
									json[prop] = (prop!="opacity")?valor:(valor=="")?1:valor;
								else if(prop == "transform")
									json[prop] = (valor=="")?"rotate(0deg)":valor;
								else if(prop == "height")
									json[prop] = (valor=="")?devolverNumeroTexto(obj,prop):Number(valor.replace("px",""));
								else if(valor == "black")
									json[prop] = "rgb(0,0,0)";
								else if(valor == "" && prop.indexOf("-shadow") != -1)
									json[prop] = "black 0px 0px 0px";
								else if(valor != "" && prop.indexOf("-shadow") != -1)
									json[prop] = valor;
								else if(valor == "" && prop == "z-index")
									json[prop] = 0;
								else if(valor == "" && prop == "font-weight")
									json[prop] = 400;                
								else if(valor == "")
									json[prop] = devolverNumeroTexto(obj,prop);
								else if(valor.indexOf("px") != -1)
									json[prop] = Number(valor.replace("px",""));
								else
									json[prop] = valor;
						}
						//Añadimos este frame como clave
						anim(identificador,obj.style,timelinegui).to(beginTo,json,duration);
						// Ponemos el timeline en pausa
						beginTo = parseFloat(arr[0]) + parseFloat(arr[1]);
						if(beginTo>endTimeline)
							endTimeline = beginTo 
						timelinegui.stop(endTimeline);
						// Sumamos uno al contador de Frame
						numFrame++;
						obj.setAttribute("termina",parseFloat(arr[0]) + parseFloat(arr[1]));
						obj.setAttribute("dura","true");
						recordUndoTimeLine();					
					}     
        }
        beginTo = parseFloat(arr[0]) + parseFloat(arr[1]);
		duration = 1;
		
      }
      AddWindow = null
    })
  }else
  {
	MessageBox("Información","No se ha seleccionado ningún elemento para crear el fotograma clave.","info",["OK"],function(){});
  }
}
function devolverNumeroTexto(obj,prop)
{
  let b = window.getComputedStyle(obj,null).getPropertyValue(prop);
  b = b.replace("px","");
  if(isNaN(b))
    return b
  else
    return Number(b)
}
function DelFrame()
{
  let self = timelinegui;
  if(supressKeyFrame)
  {
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
            {
                "title":"Atención",
                "type":"warning",
                "buttons":["Sí","No","Cancelar"],
                "defaultId":0,
                "cancelId":2,
                "noLink":true,
                "message":"¿Está seguro que desea borrar esta animación? \n"+infoDel
            },function(num)
            {
              if(num==0)
              {
                let time = self.selectedKeys[0].time;
				let identifiador = self.selectedKeys[0].track.parent.id;
				BorrarFrame(time,identifiador);
              }
            });
  }else
  {
	  MessageBox("Información","No se ha seleccionado ningún fotograma clave para su eliminación.","info",["OK"],function(){});
  }
}
/**
 * Borra una sección delimitada en segundos de un punto en la secuencia de animación para un elemento dado
 * @param {number} time Tiempo por el cual se va a identificar las secuencias a eliminar
 * @param {string} identificador Id del objeto del cual se va a borrar sus secuencias
 */
function BorrarFrame(time,identificador)
{
	let endNum = -1
	for(var num = 0;num < timelinegui.anims.length;num++)
	{
		obj = timelinegui.anims[num];
		if(obj.targetName == identificador)
		{
			if(endNum > -1)
			{
				if(obj.endTime > time)
				{
					obj.startTime = endNum;
					endNum = 0;
				}
			}
			if(obj.endTime == time)
			{
				timelinegui.anims.splice(num,1)
				endNum = obj.startTime;
				num--;
			}
		}
	}
}
function ModificarFrame()
{
  let self = timelinegui;
  let time = self.selectedKeys[0].time;
  const webview = document.querySelector("#webview");
  beginTo = 0
  duration = 0
  //Buscamos los numeros de inicio y fnal de la clave
  for(let obj of self.selectedKeys[0].track.anims)
  {
    if(obj.endTime == time)
    {
      beginTo = obj.startTime;
      duration = obj.endTime-obj.startTime;
    }
  }
  let id_for_elm = self.selectedKeys[0].track.parent.id;
  localStorage.habilitarBegin = "false"
  localStorage.timeFrame = beginTo+";"+duration+";"+ id_for_elm
  if(beginTo > 0 || duration > 0)
  {
	let AddWindow = new BrowserWindow(
		{
		  width: 380,
		  height: 240,
		  minWidth: 380,
		  minHeight: 240,
		  modal:true,
		  icon:"img/logo-32.png",
		  resizable:false,
		  title: "Modificar fotograma clave",
		  minimizable:false,
		  parent:BrowserWindow.getAllWindows()[0],
		  backgroundColor: "#333",
		  title:"Añadir fotograma clave",
		  nativeWindowOpen: true
		})
	  AddWindow.loadURL(path.join(__dirname,"/newFrame.html"))
	  AddWindow.setMenu(null);
	  AddWindow.on('closed', function () {
		if(localStorage.timeFrame != "null")
		{
		  // Recuperamos las variables
		  var arr = localStorage.timeFrame.split(";");
		  beginTo = parseFloat(arr[0]);
		  duration = parseFloat(arr[1]);
		  let identifiador = self.selectedKeys[0].track.parent.id;
		  let lastEnd = 0;
		  let forStop = 0;
		  // Modificamos los anims necesarios
		  if(webview.innerHTML.trim() != "")
		  {
			let futuro = false;
			for(let a = 0;a < timelinegui.anims.length;a++)
			{
			  let obj = timelinegui.anims[a];
			  if(obj.targetName == identifiador)
			  {
				if(obj.endTime == time)
				{
				  obj.startTime = beginTo;
				  obj.delay = beginTo;
				  obj.endTime = beginTo+duration;
				  lastEnd = obj.endTime;
				  futuro = true;
				}
				if(obj.startTime >= time && futuro)
				{
				  let duration = obj.endTime-obj.delay;
				  obj.startTime = lastEnd;
				  obj.delay = lastEnd;
				  obj.endTime = obj.startTime + duration;
				}
			  }
			  forStop = obj.endTime; 
			}
		  }
		  //Y ponemos en stop el timeline
		  timelinegui.stop(forStop);
		  beginTo = parseFloat(arr[0]) + parseFloat(arr[1]);
		  duration = 1;
		  recordUndoTimeLine(true);
		}
		AddWindow = null
	  })
  }else
  {
	MessageBox("Información","No se puede modificar el frame base de la animación.","info",["OK"],function(){});
  }
}
function MostrarSeleccionSeccion(selected)
{
	let x = window.event.clientX+"px";
	let container = document.createElement("div");
	container.style.position = "absolute";
	container.style.bottom = "170px";
	container.style.zIndex = 80;
	container.style.color = "white";
	container.style.padding = "5px 10px";
	container.style.fontSize = "12px";
	container.style.fontWeight = "bold";
	container.style.left = x;
	container.style.width = "170px";
	container.style.height = "32px";
	container.style.boxShadow = "0 0 3px white;";
	container.style.backgroundColor = "#343a40";
	container.style.border = "solid 1px white";
	container.style.borderRadius = "10px";
	container.style.opacity = "1"
	container.style.display = "block"
	container.style.transition = "opacity 1s ease-in-out";
	container.innerHTML = selected.track.parent.id+" - "+selected.time+"s";
	document.body.appendChild(container)
	window.setTimeout(ocultar,800)
	function ocultar()
	{
		container.style.opacity = "0"
		evento = window.setTimeout(function()
		{
			container.remove();
		},1000)
	}
}
function CambiarIdentificador(newname)
{
	if(elmSeleccionado != null)
	{
		let elm = elmSeleccionado.nodeName.toLowerCase()+"#"+elmSeleccionado.id+"."+elmSeleccionado.className;
		let elmnt = document.querySelector("#outline *[identificador='"+elm+"']")
		elmnt.setAttribute("identificador",elm.replace(/#[a-z|0-9|\-|\_]*/g,"#"+newname));
		elmnt.querySelector("b").innerHTML = elm.replace(/#[a-z|0-9|\-|\_]*/g,"#"+newname)
		for(let obj of timelinegui.anims)
		{
			if(elm == obj.targetName)
			{
				obj.targetName = elm.replace(/#[a-z|0-9|\-|\_]*/g,"#"+newname);
				obj.parent.name = elm.replace(/#[a-z|0-9|\-|\_]*/g,"#"+newname);
				obj.parent.targetName = elm.replace(/#[a-z|0-9|\-|\_]*/g,"#"+newname);
			}
		}
	}
}
function CambiarClase(newname)
{
	if(elmSeleccionado != null)
	{
		if(Array.isArray(elmSeleccionado))
		{
			for(let obj of elmSeleccionado)
			{
				let elm = obj.nodeName.toLowerCase()+"#"+obj.id+"."+obj.className;
				let elmnt = document.querySelector("#outline *[identificador='"+elm+"']")
				elmnt.setAttribute("identificador",elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname));
				elmnt.querySelector("b").innerHTML = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname)
				for(let obj of timelinegui.anims)
				{
					if(elm == obj.targetName)
					{
						obj.targetName = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname);
						obj.parent.name = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname);
						obj.parent.targetName = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname);
					}
				}	
			}
		}else
		{
			let elm = elmSeleccionado.nodeName.toLowerCase()+"#"+elmSeleccionado.id+"."+elmSeleccionado.className;
			let elmnt = document.querySelector("#outline *[identificador='"+elm+"']")
			elmnt.setAttribute("identificador",elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname));
			elmnt.querySelector("b").innerHTML = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname)
			for(let obj of timelinegui.anims)
			{
				if(elm == obj.targetName)
				{
					obj.targetName = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname);
					obj.parent.name = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname);
					obj.parent.targetName = elm.replace(/\.[a-z|0-9|\-|\_]*/g,"."+newname);
				}
			}	
		}	
	}
}
function ModoReproduccion(activo)
{
	let container = document.createElement("div");
	container.style.background = "rgba(33,33,33,0.1)";
	container.style.width = "100%"
	container.style.height = "100%";
	container.id = "divModoRep"
	container.style.position = "absolute";
	container.style.top = "0"
	container.style.left = "0"
	container.style.padding = "21px"
	container.style.zIndex = "150"
	container.innerHTML="<strong>Modo reproducción</strong>";
	if(activo)
	{
		if(document.querySelector("#divModoRep") == undefined)
			document.querySelector("#renderer").appendChild(container)
	}else
	{
		try
		{
			document.querySelector("#divModoRep").remove()
		}catch(ex){}
	}	
}
/**
 * Hace aparecer un Mensaje del sistema según los parametros mandados
 * @param {string} title 
 * @param {string} message 
 * @param {enum} type 
 * @param {array} button 
 * @param {function} callback 
 */
function MessageBox(title,message,type,button,callback)
{
	dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
	{
		"title":title,
		"type":type,
		"buttons":button,
		"defaultId":0,
		"cancelId":2,
		"noLink":true,
		"message":message
	},function(num)
	{
	  callback(num);
	});
}
