Timeline();
function Timeline()
{
	let cssEstilo = document.createElement("style");
	let maxTime = 12;
	let tiempo_segundo = 0;
	let animationRunning = [];
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
			"target":document.querySelector("#elm65").style
		},
		{
			"startValue":"0",
			"endValue":"50",
			"startTime":0,
			"endTime":1,
			"propertyName":"margin-top",
			"prefix":"px",
			"targetName":"div#elm65.default",
			"target":document.querySelector("#elm65").style
		},
		{
			"startValue":"#fff",
			"endValue":"#333",
			"startTime":4.5,
			"endTime":5.5,
			"propertyName":"background-color",
			"targetName":"div#elm85.default",
			"target":document.querySelector("#elm85").style     
		},
		{
			"startValue":"0",
			"endValue":"80",
			"startTime":0,
			"endTime":1,
			"propertyName":"margin-left",
			"prefix":"px",
			"targetName":"div#elm65.default",
			"target":document.querySelector("#elm65").style
		},
		{
			"startValue":"25",
			"endValue":"38",
			"startTime":2,
			"endTime":4,
			"propertyName":"margin-top",
			"prefix":"px",
			"targetName":"div#elm85.default",
			"target":document.querySelector("#elm85").style
		},
		{
			"startValue":"84",
			"endValue":"98",
			"startTime":6,
			"endTime":10,
			"prefix":"px",
			"propertyName":"margin-left",
			"targetName":"div#elm85.default",
			"target":document.querySelector("#elm85").style
		},
		{
			"startValue":"0",
			"endValue":"50",
			"startTime":0,
			"endTime":1.5,
			"propertyName":"border-radius",
			"targetName":"div#elm85.default",
			"prefix":"px",
			"target":document.querySelector("#elm85").style
		},
		{
			"startValue":"84",
			"endValue":"98",
			"startTime":6,
			"endTime":10,
			"prefix":"px",
			"propertyName":"margin-left",
			"targetName":"div#elm105.default",
			"target":document.querySelector("#elm105").style
		},
		{
			"startValue":"0",
			"endValue":"10",
			"startTime":0,
			"endTime":1.5,
			"propertyName":"border-radius",
			"targetName":"div#elm105.default",
			"prefix":"px",
			"target":document.querySelector("#elm105").style
		}
	];
	CargarTimeline();
	function CargarTimeline()
	{
		if(localStorage.maxTime != undefined && localStorage.maxTime == "")
			maxTime = Number(localStorage.maxTime);
		CargarTiempo();
		CargarLineasdeTiempo();
		CargarScroll();
		document.querySelector("#currentTime").innerHTML = "0.00 s / "+MaximoTiempo()+" s";
		document.head.appendChild(cssEstilo)
		CargarAnimacion();
		CargarControles();
		CargarTracker();
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
			texto.style.display = "inline-block";
			texto.style.cursor = "pointer";
			texto.onclick = function(){Tracker((sec+1),true);};
			texto.innerHTML = (sec+1)+"s";
			contenedor.appendChild(texto);
		}
		document.querySelector("#timespan").style.width = (153*maxTime)+"px";
		document.querySelector("#slidescrollcontain").style.width = (153*maxTime)+"px";
	}
	function sortAnimation(anims)
	{
		return anims.sort(function(a,b)
		{
			let num = Number(a.time);
			let num2 = Number(b.time);
			return (num>num2)?1:(num==num2)?0:-1;
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
			let anchoTotal = window.getComputedStyle(document.querySelector("#slide")).getPropertyValue("height");
			let anchoVisible = window.getComputedStyle(document.querySelector("#slidescrollcontain")).getPropertyValue("height");
			let anchoDisponible = Number(anchoTotal.replace("px",""))-Number(anchoVisible.replace("px",""));
			document.querySelector("#timespan").style.transform = "translateX(-"+this.scrollLeft+"px)";
			this.scrollTop = (this.scrollTop>anchoDisponible)?anchoDisponible:this.scrollTop;
			document.querySelector("#elements").scrollTop = this.scrollTop;
			document.querySelector("#slide-tracker").style.marginTop = this.scrollTop+"px";
		})
		document.querySelector("#elements").addEventListener("wheel",function(event)
		{
			this.scrollTop += (event.deltaY/5);
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
		document.querySelector("#play").addEventListener("click",function(){play();})
		document.querySelector("#pause").addEventListener("click",function(){pause();})
		document.querySelector("#stop").addEventListener("click",function(){stop();})
	}
	/**
	 * Carga la animación Keyframe según un tiempo y una duración
	 */
	function CargarAnimacion()
	{
		let animate = convertInKeyframeModule();
		animate = sortAnimation(animate);
		let propertyChange = {};
		let oldElm = null;
		let conf = 
		{
			duration: MaximoTiempo()*1000,
			iterations:Infinity
		};
		for(let anims of animate)
		{
			let obj = {};
			obj[convertInJavascript(anims.propertyName)] = anims.value+anims.prefix;
			obj["offset"] = anims.time/MaximoTiempo();
			if(propertyChange[anims.targetName] == null)
				propertyChange[anims.targetName] = [];
			propertyChange[anims.targetName].push(obj);
		}
		for(let elm in propertyChange)
		{
			let obj = document.querySelector(elm);
			let json = propertyChange[elm];
			console.log(obj);
			console.log(json);
			animationRunning.push(obj.animate(json,conf));
		}
	}
	function convertInJavascript(name)
	{
		let num = name.indexOf("-")
		name = name.substring(0,num)+name.substring(num+1)
		name = name.replace(name[num],name[num].toUpperCase());
		return name;
	}
	function convertInKeyframeModule()
	{
		let time = 0;
		let animationKey = [];
		for(anims of animation)
		{
			if(anims.startTime >= time)
			{
				animationKey.push({
					"value":anims.startValue,
					"time":(anims.startTime-time).toFixed(2),
					"propertyName":anims.propertyName,
					"targetName":anims.targetName,
					"prefix":anims.prefix,
					"target":anims.target});
			}
			if(anims.endTime >= time)
			{
				animationKey.push({
					"value":anims.endValue,
					"time":(anims.endTime-time).toFixed(2),
					"propertyName":anims.propertyName,
					"targetName":anims.targetName,
					"prefix":anims.prefix,
					"target":anims.target});
			}
		}
		return animationKey;
	}
	function play(played)
	{

		playing = true;
	}
	function pause()
	{
		playing = false;
	}
	function stop()
	{
		
		playing = false;
	}
	function getStyleModifierOfAnimation()
	{
		let res = [];
		for(let anims of animation)
			if(res.indexOf(anims.propertyName) == -1)
				res.push(anims.propertyName)
		return res;
	}
	function CargarTracker()
	{
		document.querySelector("#slide-tracker").addEventListener("mousedown",function(event)
		{
			document.body.onmousemove = function(ev)
			{
				let x2 = (ev.clientX-175)+document.querySelector("#slidescroll").scrollLeft;
				if(x2 > 0)
					document.querySelector("#slide-tracker").style.left = x2+"px"
				ActualizarAnimacion((x2/151));
			}
			document.body.onmouseup = function()
			{
				document.body.onmousemove = null;
			}
		})
	}
	function Tracker(sec,actualiza)
	{
		document.querySelector("#slide-tracker").style.left = ((151*sec)-20)+"px"
		if(((151*sec)-20) > document.querySelector("#slidescroll").offsetWidth-80)
		{
			let num = ((151*sec)-20);
			document.querySelector("#slidescroll").scrollLeft = num+document.querySelector("#slidescroll").offsetWidth-80;
		}
		if(sec < 1)
		{
			document.querySelector("#slidescroll").scrollLeft = 0;
		}
		if(actualiza != undefined && actualiza == true)
			ActualizarAnimacion(sec);
	}
	function ActualizarAnimacion(sec)
	{
		document.querySelector("#currentTime").innerHTML = (tiempo_segundo.toFixed(2))+" s / "+MaximoTiempo()+" s";
	}
}
