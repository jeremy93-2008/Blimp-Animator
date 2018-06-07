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
		sortByNameAnimation();
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
	function sortByNameAnimation()
	{
		animation = animation.sort(function(a,b)
		{
			return (a.targetName.localeCompare(b.targetName)==0?(a.propertyName.localeCompare(b.propertyName)):(a.targetName.localeCompare(b.targetName)));
		});
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
		timeSlide.setAttribute("nodo",tag)
		timeSlide.setAttribute("property",anims.propertyName)
		timeSlide.style.marginLeft = (ancho*anims.startTime)+"px";
		timeSlide.style.borderRadius = "10px";
		timeSlide.style.cursor = "move";
		timeSlide.style.display="inline-block";
		timeSlide.style.marginTop = top+"px";
		timeSlide.style.verticalAlign = "top";
		timeSlide.style.marginRight = "10px";
		timeSlide.style.marginBottom = "5px";
		timeSlide.onmousedown = function(){MoverSlide(timeSlide,event)};
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
		}
		for(let anims of animate)
		{
			let obj = {};
			let prefijo = (anims.prefix==undefined)?"":anims.prefix;
			obj[convertInJavascript(anims.propertyName)] = anims.value+prefijo;
			obj["offset"] = anims.time/MaximoTiempo();			
			if(propertyChange[anims.targetName] == null)
			{
				propertyChange[anims.targetName] = [];
				propertyChange[anims.targetName].push(addCommonLineInAnim());
			}
			propertyChange[anims.targetName].push(obj);
		}
		console.log(propertyChange);
		for(let elm in propertyChange)
		{
			propertyChange[elm].push(addCommonLineInAnim());
			let obj = document.querySelector(elm);
			let json = propertyChange[elm];
			let anim = obj.animate(json,conf);
			anim.id = elm;
			anim.pause();
			animationRunning.push(anim);
			console.log(anim);
		}
	}
	function addCommonLineInAnim()
	{
		let ob = {};
		let arr = getStyleModifierOfAnimation()
		for(let str of arr)
		{
			if(str.indexOf("color") != -1)
				ob[convertInJavascript(str)] = "#fff";
			else if(str.indexOf("transform") != -1 || str.indexOf("box-shadow") != -1 || str.indexOf("text-shadow") != -1)
				ob[convertInJavascript(str)] = "none";
			else
				ob[convertInJavascript(str)] = "0";
		}
		return ob;
	}
	function convertInJavascript(name)
	{
		let txt = "";
		let tabla = name.split("-")
		for(let i = 0; i < tabla.length;i++)
		{
			if(i == 0)
			{
				txt += tabla[i]
			}else
			{
				let char = tabla[i][0].toUpperCase();
				txt += char+tabla[i].substring(1);
			}
		}
		return txt;
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
	function play()
	{
		for(let anims of animationRunning)
		{
			anims.play();
		}
		intervalo = window.setInterval(function()
		{
			tiempo_segundo = animationRunning[0].currentTime/1000;
			document.querySelector("#currentTime").innerHTML = (tiempo_segundo.toFixed(2))+" s / "+MaximoTiempo()+" s";
			if((tiempo_segundo.toFixed(2)) >= MaximoTiempo())
			{
				tiempo_segundo = 0;
			}
			Tracker(tiempo_segundo);
		},10);
		playing = true;
	}
	function pause()
	{
		for(let anims of animationRunning)
		{
			anims.pause();
		}
		playing = false;
	}
	function stop()
	{
		for(let anims of animationRunning)
		{
			anims.currentTime = 0;
			anims.pause();
		}
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
				document.body.onmouseup = null;
			}
		})
	}
	function Tracker(sec,actualiza)
	{
		console.log(sec);
		document.querySelector("#slide-tracker").style.left = (151*sec)+"px"
		if(((151*sec)-20) > document.querySelector("#slidescroll").offsetWidth-80)
		{
			let num = ((151*sec)-20);
			document.querySelector("#slidescroll").scrollLeft = num+document.querySelector("#slidescroll").offsetWidth-80;
		}
		if(sec < 1)
		{
			document.querySelector("#slidescroll").scrollLeft = 0;
		}
		if(actualiza)
			ActualizarAnimacion(sec);
	}
	function ActualizarAnimacion(sec)
	{
		if(sec < 0)
			sec = 0;
		tiempo_segundo = sec;
		console.log(tiempo_segundo);
		for(let anims of animationRunning)
		{
			anims.currentTime = sec*1000;
		}
		document.querySelector("#currentTime").innerHTML = (tiempo_segundo.toFixed(2))+" s / "+MaximoTiempo()+" s";
	}
	function CambiarAnimacion(oldTime,start,end,elm)
	{
		for(let anims of animation)
		{
			let tag = elm.getAttribute("nodo").replace("target-","");
			if(anims.targetName.replace("#","").replace(".","") == tag)
				if(anims.propertyName == elm.getAttribute("property"))
					if(anims.startTime == oldTime)
						console.log(anims);
		}
		//CargarAnimacion();
	}
	function MoverSlide(elm,event)
	{
		let x = event.clientX;
		let margen = Number(elm.style.marginLeft.replace("px",""));
		elm.style.outline = "solid 2px #eee";
		document.body.onmousemove = function(event)
		{
			//let old = Number(elm.style.marginLeft.replace("px",""));
			let x2 = event.clientX;
			let xFinal = x2-x;
			if((margen+xFinal) > 0)
			{
				elm.style.marginLeft = margen+xFinal;
				let start = Number(elm.style.marginLeft.replace("px",""))/151;
				let end = (elm.offsetWidth+Number(elm.style.marginLeft.replace("px","")))/151;
				CambiarAnimacion(Number((margen/151).toFixed(2)),start,end,elm);
			}	
		}
		document.body.onmouseup = function()
		{
			elm.style.outline = "none";
			document.body.onmousemove = null;
			document.body.onmouseup = null;
		}
	}
}
