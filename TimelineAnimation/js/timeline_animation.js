let cssEstilo = document.createElement("style");
let maxTime = 12;
let num_color = 0;
let elm_oculto = [];
let animation = 
[
    {
        "startValue":"20",
        "endValue":"90",
        "startTime":1.25,
		"endTime":2.5,
		"prefix":"px",
        "propertyName":"margin-left",
        "targetName":"div#elm65.default",
		"target":document.querySelector("#elm65").style,
		"object":document.querySelector("#elm65")
    },
    {
        "startValue":"0",
        "endValue":"50",
        "startTime":0,
        "endTime":1,
		"propertyName":"margin-top",
		"prefix":"px",
        "targetName":"div#elm65.default",
        "target":document.querySelector("#elm65").style,
		"object":document.querySelector("#elm65")
    },
    {
        "startValue":"#fff",
        "endValue":"#333",
        "startTime":4.5,
        "endTime":5.5,
        "propertyName":"background-color",
        "targetName":"div#elm85.default",
        "target":document.querySelector("#elm85").style,
		"object":document.querySelector("#elm85")        
    },
    {
        "startValue":"0",
        "endValue":"80",
        "startTime":0,
        "endTime":1,
		"propertyName":"margin-left",
		"prefix":"px",
        "targetName":"div#elm65.default",
        "target":document.querySelector("#elm65").style,
		"object":document.querySelector("#elm65") 
    },
    {
        "startValue":"25",
        "endValue":"38",
        "startTime":2,
        "endTime":4,
		"propertyName":"margin-top",
		"prefix":"px",
        "targetName":"div#elm85.default",
        "target":document.querySelector("#elm85").style,
		"object":document.querySelector("#elm85")   
	},
	{
        "startValue":"84",
        "endValue":"98",
        "startTime":6,
		"endTime":10,
		"prefix":"px",
        "propertyName":"margin-left",
        "targetName":"div#elm85.default",
        "target":document.querySelector("#elm85").style,
		"object":document.querySelector("#elm85")   
    },
    {
        "startValue":"0",
        "endValue":"50",
        "startTime":0,
        "endTime":1.5,
        "propertyName":"border-radius",
        "targetName":"div#elm85.default",
        "prefix":"px",
        "target":document.querySelector("#elm85").style,
		"object":document.querySelector("#elm85")   
    },
	{
        "startValue":"84",
        "endValue":"98",
        "startTime":6,
		"endTime":10,
		"prefix":"px",
        "propertyName":"margin-left",
        "targetName":"div#elm105.default",
        "target":document.querySelector("#elm105").style,
		"object":document.querySelector("#elm105")   
    },
    {
        "startValue":"0",
        "endValue":"50",
        "startTime":0,
        "endTime":1.5,
        "propertyName":"border-radius",
        "targetName":"div#elm105.default",
        "prefix":"px",
        "target":document.querySelector("#elm105").style,
		"object":document.querySelector("#elm105")   
    },
    {
        "startValue":"",
        "endValue":"url('')",
        "startTime":1,
        "endTime":3.5,
        "propertyName":"background-image",
        "targetName":"div#elm105.default",
        "target":document.querySelector("#elm105").style,
		"object":document.querySelector("#elm105")   
    }
];
CargarTimeline();
function CargarTimeline()
{
    if(localStorage.maxTime != undefined && localStorage.maxTime == "")
        maxTime = Number(localStorage.maxTime);
    CargarTiempo();
    sortAnimation();
	CargarLineasdeTiempo();
	CargarScroll();
	document.head.appendChild(cssEstilo)
	CargarControles();
}
function CargarTiempo()
{
    let contenedor = document.querySelector("#timespan");
    for(let sec = 0;sec < maxTime;sec++)
    {
        let segundo = document.createElement("div");
        segundo.style.width="150px";
        segundo.style.height = "50%";
        segundo.style.display = "inline-block";
        segundo.style.verticalAlign = "top";
        segundo.style.borderRight = "solid 1px #555";
        contenedor.appendChild(segundo.cloneNode(true));
        let texto = document.createElement("span")
        texto.className = "sec";
        texto.innerHTML = (sec+1)+"s";
        contenedor.appendChild(texto);
    }
	document.querySelector("#timespan").style.width = (165*maxTime)+"px";
	document.querySelector("#slidescrollcontain").style.width = (165*maxTime)+"px";
}
function sortAnimation()
{
    animation = animation.sort(function(a,b)
    {
        return (a.targetName.localeCompare(b.targetName)==0?(a.propertyName.localeCompare(b.propertyName)):(a.targetName.localeCompare(b.targetName)));
    });
}
function CargarLineasdeTiempo()
{
	LimpiarLineadeTiempo()
    let currentTarget = "";
	let sameTrack = "";
	let top = 0;
	let primero = false;
    for(let anims of animation)
    {
		let nuevoHeader = false;
        //Cargamos el encabezado si procede
        if(currentTarget == "" || currentTarget != anims.targetName)
        {
            currentTarget =  anims.targetName;
            let parent = document.createElement("div");
            parent.id = "target-"+currentTarget.replace("#","").replace(".","");
            parent.innerHTML = "<label class='title'>"+currentTarget+"</label>";
            parent.style.height="28px";
            document.querySelector("#elements").appendChild(parent);
			sameTrack = "";
			if(!primero)
			{
				parent.className="firstelm";
				primero = true;
			}
			top += 34;
			nuevoHeader = true;
		}
		if(elm_oculto.indexOf("target-"+anims.targetName.replace("#","").replace(".","")) == -1)
		{
			//Cargamos todos los hijos a quienes le corresponden un atributo en conccreto en la linea de tiempo
			if(sameTrack != anims.propertyName)
			{
				let children = document.createElement("div");
				children.className = "property";
				children.setAttribute("target-"+currentTarget.replace("#","").replace(".",""),"");
				children.style.height = "24px";
				children.innerHTML = "<label>"+anims.propertyName+"</label>";
				document.querySelector("#elements").appendChild(children);
				sameTrack = anims.propertyName;
				let border = document.createElement("div");
				border.className="salta";
				border.setAttribute("target-"+currentTarget.replace("#","").replace(".",""),"");
				document.querySelector("#slide").appendChild(border);
				num_color++;
				if(!nuevoHeader)
					top = 0;
				//Creamos el track y añadimos el tiempo en el track del objeto JSON
				CrearTrackSlide(top,anims,"target-"+currentTarget.replace("#","").replace(".",""))
			}else
			{
				//Existe ya un track con esta propiedad asi que solo vamos a añadir el tiempo en el track que corresponde con el objeto
				CrearTrackSlide(top,anims,"target-"+currentTarget.replace("#","").replace(".",""))
			}
		}
	}
	document.querySelector("#slide").style.minHeight = document.querySelector("#elements").scrollHeight;
	CargarInteractividad();
	document.querySelector("#slidescroll").scrollTop = document.querySelector("#elements").scrollTop;
}
function CrearTrackSlide(top,anims,tag)
{
	let num_color = parseInt((anims.propertyName.length/5)-1);
	let ancho = document.querySelector("#timespan div").offsetWidth+6; //Este seis corresponde al margin del span que indica los segundos
    let duration = anims.endTime-anims.startTime; 
    let color = ["#6C15C9","#1572C9","#c96c15","#7B0CE8","#FFF30D"];
    let timeSlide = document.createElement("div");
	timeSlide.style.width = (ancho * duration) + "px";
	timeSlide.style.height = "24px";
	timeSlide.setAttribute(tag,"")
    timeSlide.style.marginLeft = (ancho*anims.startTime)+"px";
	timeSlide.style.borderRadius = "10px";
	timeSlide.style.cursor = "move";
	timeSlide.style.display="inline-block";
	timeSlide.style.marginTop = top+"px";
    timeSlide.style.verticalAlign = "top";
    timeSlide.style.marginRight = "10px";
	timeSlide.style.marginBottom = "5px";
	num_color = (num_color>4)?0:num_color;
	timeSlide.style.backgroundColor = color[num_color]
    document.querySelector("#slide").appendChild(timeSlide);
}
function CargarScroll()
{
	document.querySelector("#slidescroll").addEventListener("scroll",function(event)
	{
		document.querySelector("#timespan").style.transform = "translateX(-"+this.scrollLeft+"px)";
		document.querySelector("#elements").scrollTop = this.scrollTop;
	})
	document.querySelector("#elements").addEventListener("wheel",function(event)
	{
		this.scrollTop += (event.deltaY/10);
		document.querySelector("#slidescroll").scrollTop = this.scrollTop;
	})
}
function LimpiarLineadeTiempo()
{
	document.querySelector("#slide").innerHTML = "";
	document.querySelector("#elements").innerHTML = "";
}
function VerOcultarTarget(nombre)
{
	let posicion = elm_oculto.indexOf(nombre) 
	if(posicion != -1)
	{
		elm_oculto.splice(posicion,1)
	}else
	{
		elm_oculto.push(nombre);
	}
	CargarLineasdeTiempo()
}
function CargarInteractividad()
{
	document.querySelectorAll("#elements label.title").forEach((elm)=>
	{
		elm.addEventListener("click",()=>
		{
			VerOcultarTarget("target-"+elm.innerHTML.replace("#","").replace(".",""));
		})
	});
}
function MaximoTiempo()
{
	let res = 0;
	for(let anims of animation)
	{
		res = (res<anims.endTime)?anims.endTime:res;
	}
	return res;
}
function CargarControles()
{
	sortAnimation();
	let currentTarget = "";
	let currentTime = -1;
	let texto = "";
	let firstElement = null;
	for(let anims of animation)
	{
		let pasokeyframe = false;
		if(currentTarget == "" || currentTarget != anims.targetName)
		{
			if(currentTarget != anims.targetName && currentTarget != "")
				texto += "}}";
			texto += "\n@keyframes "+anims.targetName.replace("#","").replace(".","")+" {\n";
			firstElement = anims.object;
			currentTarget = anims.targetName;
			anims.target.animation = anims.targetName.replace("#","").replace(".","")+" "+MaximoTiempo()+"s ease 0s 1 normal none paused";
			pasokeyframe = true;
		}
		if(currentTime == -1 || currentTime != anims.endTime)
		{
			if(currentTime != anims.endTime && currentTime != -1 && !pasokeyframe)
				texto += "}\n";
			let porcentaje = ((MaximoTiempo()/anims.endTime)*10);
			texto += porcentaje.toFixed(2)+"% {\n";
			currentTime = anims.endTime
		}
		if(anims.endTime == currentTime)
		{
			let prefijo = (anims.prefix==undefined?"":anims.prefix)
			texto += anims.propertyName+":"+anims.endValue+prefijo+";\n";
		}
	}
	texto += "}}";
	cssEstilo.innerHTML = texto;
	document.querySelector("#play").addEventListener("click",function(){play();})
	document.querySelector("#pause").addEventListener("click",function(){pause();})
	firstElement.addEventListener("webkitAnimationStart",function()
	{
		console.log("animation ha empezado");
	},false);
	firstElement.addEventListener("webkitAnimationEnd",function()
	{
		console.log("animation se ha pausado");
	},false);
}
function play()
{
	for(let anims of animation)
	{
		anims.target.animationPlayState = "running";
	}
}
function pause()
{
	for(let anims of animation)
	{
		anims.target.animationPlayState = "paused";
	}
}
function stop()
{
	
}