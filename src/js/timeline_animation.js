class Timeline
{
	Cargar(json_anim)
	{
		this.maxTime = 12;
		this.tiempo_segundo = 0;
		this.intervalo = null;
		this.animationRunning = [];
		this.elm_oculto = [];
		if(json_anim != undefined)
		{
			this.animation = json_anim
		}else
		{
			this.CargarElmPrueba();
			this.animation = 
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
		}
		this.CargarTimeline();
	}
	get animations()
	{
		return this.animation;
	}
	set animations(value)
	{
		this.animation = value;
		this.refreshTimeline();
	}
	CargarTimeline()
	{
		this.maxTime = (Number(this.MaximoTiempo()+1)>this.maxTime)?Number(this.MaximoTiempo()+1):this.maxTime;
		this.sortByNameAnimation();
		this.CargarTiempo();
		this.CargarLineasdeTiempo();
		this.CargarScroll();
		document.querySelector("#currentTime").innerHTML = "0.00 s / <input type='number' step='1' id='MaximoTiempoInput' value='"+this.MaximoTiempo()+"' /> s";
		this.CargarAnimacion();
		this.CargarControles();
		this.CargarTracker();
	}
	CargarTiempo(tiempo)
	{
		let contenedor = document.querySelector("#timespan");
		contenedor.innerHTML = "";
		if(tiempo != undefined)
			this.maxTime = tiempo;
		for(let sec = 0;sec < this.maxTime;sec++)
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
			texto.onclick = function(){this.Tracker((sec+1),true);};
			texto.innerHTML = (sec+1)+"s";
			contenedor.appendChild(texto);
		}
		document.querySelector("#timespan").style.width = (153*this.maxTime)+"px";
		document.querySelector("#slidescrollcontain").style.width = (153*this.maxTime)+"px";
	}
	sortByNameAnimation()
	{
		this.animation = this.animation.sort(function(a,b)
		{
			return (a.targetName.localeCompare(b.targetName)==0?(a.propertyName.localeCompare(b.propertyName)):(a.targetName.localeCompare(b.targetName)));
		});
	}
	sortAnimation(anims)
	{
		return anims.sort(function(a,b)
		{
			let num = Number(a.time);
			let num2 = Number(b.time);
			return (num>num2)?1:(num==num2)?0:-1;
		});
	}
	CargarLineasdeTiempo()
	{
		this.LimpiarLineadeTiempo()
		let currentTarget = "";
		let sameTrack = "";
		let top = 0;
		let primero = false;
		for(let anims of this.animation)
		{
			let nuevoHeader = false;
			//Cargamos el encabezado si procede
			if(currentTarget == "" || currentTarget != anims.targetName)
			{
				currentTarget =  anims.targetName;
				let parent = document.createElement("div");
				parent.id = "target-"+currentTarget.replace("#","").replace(".","");
				parent.innerHTML = "<label class='title'>"+currentTarget+"</label>";
				parent.style.height="33px";
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
			if(this.elm_oculto.indexOf("target-"+anims.targetName.replace("#","").replace(".","")) == -1)
			{
				//Cargamos todos los hijos a quienes le corresponden un atributo en conccreto en la linea de tiempo
				if(sameTrack != anims.propertyName)
				{
					let children = document.createElement("div");
					children.className = "property";
					children.setAttribute("target-"+currentTarget.replace("#","").replace(".",""),"");
					children.style.height = "29px";
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
					this.CrearTrackSlide(top,anims,"target-"+currentTarget.replace("#","").replace(".",""))
				}else
				{
					//Existe ya un track con esta propiedad asi que solo vamos a añadir el tiempo en el track que corresponde con el objeto
					this.CrearTrackSlide(top,anims,"target-"+currentTarget.replace("#","").replace(".",""))
				}
			}
		}
		document.querySelector("#slide").style.minHeight = document.querySelector("#elements").scrollHeight;
		this.CargarInteractividad();
		document.querySelector("#slidescroll").scrollTop = document.querySelector("#elements").scrollTop;
	}
	CrearTrackSlide(top,anims,tag)
	{
		let num_color = parseInt((anims.propertyName.length/5)-1);
		let ancho = document.querySelector("#timespan div").offsetWidth+6; //Este seis corresponde al margin del span que indica los segundos
		let duration = anims.endTime-anims.startTime; 
		let color = ["#6C15C9","#1572C9","#c96c15","#7B0CE8","#FFF30D"];
		let timeSlide = document.createElement("div");
		timeSlide.style.width = (ancho * duration) + "px";
		timeSlide.style.height = "24px";
		timeSlide.title = "Deje pulsado el botón izquierdo del ratón para mover la pista, y Ctrl+Dejar pulsado para cambiar su duración";
		timeSlide.setAttribute(tag,"")
		timeSlide.setAttribute("nodo",tag)
		timeSlide.setAttribute("property",anims.propertyName)
		timeSlide.style.marginLeft = (ancho*anims.startTime)+"px";
		timeSlide.style.borderRadius = "10px";
		timeSlide.style.cursor = "move";
		timeSlide.style.minWidth = "2px";
		if(anims.endTime == 0)
		{
			timeSlide.style.pointerEvents = "none";
		}
		timeSlide.style.display="inline-block";
		timeSlide.style.marginTop = top+"px";
		timeSlide.style.verticalAlign = "top";
		timeSlide.style.marginRight = "10px";
		timeSlide.style.marginBottom = "5px";
		timeSlide.onmousedown = ()=>{this.MoverSlide(timeSlide,event)};
		num_color = (num_color>4)?0:num_color;
		timeSlide.style.backgroundColor = color[num_color]
		document.querySelector("#slide").appendChild(timeSlide);
	}
	CargarScroll()
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
	LimpiarLineadeTiempo()
	{
		document.querySelector("#slide").innerHTML = "";
		document.querySelector("#elements").innerHTML = "";
	}
	VerOcultarTarget(nombre)
	{
		let posicion = this.elm_oculto.indexOf(nombre) 
		if(posicion != -1)
		{
			this.elm_oculto.splice(posicion,1)
		}else
		{
			this.elm_oculto.push(nombre);
		}
		this.CargarLineasdeTiempo()
	}
	CargarInteractividad()
	{
		document.querySelectorAll("#elements label.title").forEach((elm)=>
		{
			elm.addEventListener("click",()=>
			{
				this.VerOcultarTarget("target-"+elm.innerHTML.replace("#","").replace(".",""));
			})
		});
	}
	MaximoTiempo()
	{
		let res = 0;
		for(let anims of this.animation)
		{
			res = (res<anims.endTime)?anims.endTime:res;
		}
		return res;
	}
	CargarControles()
	{
		document.querySelector("#play").addEventListener("click",()=>{this.play();})
		document.querySelector("#pause").addEventListener("click",()=>{this.pause();})
		document.querySelector("#stop").addEventListener("click",()=>{this.stop();})
		this.CargarControlTiempo();
	}
	CargarControlTiempo()
	{
		document.querySelector("#MaximoTiempoInput").addEventListener("keydown",(event)=>
		{
			if(event.key == "Enter")
			{
				this.CambiarTiempo(document.querySelector("#MaximoTiempoInput"));
			}
		});
		document.querySelector("#MaximoTiempoInput").addEventListener("blur",()=>
		{
			this.CambiarTiempo(document.querySelector("#MaximoTiempoInput"));
		});
	}
	CambiarTiempo(that)
	{
		if(Number(that.value) > this.MaximoTiempo()+1)
		{
			that.value = Math.round(that.value);
			this.CargarTiempo(Number(that.value));
			this.CargarLineasdeTiempo();
		}else
		{
			that.value = this.MaximoTiempo()+1;
			this.CargarTiempo(Number(parseInt(that.value)));
			this.CargarLineasdeTiempo();				
		}
	}
	/**
	 * Carga la animación Keyframe según un tiempo y una duración
	 */
	CargarAnimacion()
	{
		let animate = this.convertInKeyframeModule();
		animate = this.sortAnimation(animate);
		let propertyChange = {};
		let oldElm = null;
		let conf = 
		{
			duration: this.MaximoTiempo()*1000,
			iterations:Infinity
		}
		for(let anims of animate)
		{
			let obj = {};
			let prefijo = (anims.prefix==undefined)?"":anims.prefix;
			obj[this.convertInJavascript(anims.propertyName)] = anims.value+prefijo;
			if(!isNaN(parseFloat(anims.time)/this.MaximoTiempo()))
				obj["offset"] = parseFloat(anims.time)/this.MaximoTiempo();			
			if(propertyChange[anims.targetName] == null)
			{
				propertyChange[anims.targetName] = [];
				propertyChange[anims.targetName].push(this.addCommonLineInAnim());
			}
			propertyChange[anims.targetName].push(obj);
		}
		for(let elm in propertyChange)
		{
			propertyChange[elm].push(this.addCommonLineInAnim());
			let obj = document.querySelector(elm);
			let json = propertyChange[elm];
			let anim = obj.animate(json,conf);
			anim.id = elm;
			anim.pause();
			this.animationRunning.push(anim);
		}
	}
	addCommonLineInAnim()
	{
		let ob = {};
		let arr = this.getStyleModifierOfAnimation()
		for(let str of arr)
		{
			if(str.indexOf("color") != -1)
				ob[this.convertInJavascript(str)] = "#fff";
			else if(str.indexOf("transform") != -1 || str.indexOf("box-shadow") != -1 || str.indexOf("text-shadow") != -1)
				ob[this.convertInJavascript(str)] = "none";
			else if(str == "font-weight")
				ob[this.convertInJavascript(str)] = "400";
			else
				ob[this.convertInJavascript(str)] = "0";
		}
		return ob;
	}
	convertInJavascript(name)
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
	convertInKeyframeModule()
	{
		let time = 0;
		let animationKey = [];
		for(let anims of this.animation)
		{
			if(anims.startTime >= time)
			{
				if(anims.startValue != "")
				{
					animationKey.push({
						"value":anims.startValue,
						"time":(anims.startTime-time).toFixed(2),
						"propertyName":anims.propertyName,
						"targetName":anims.targetName,
						"prefix":anims.prefix,
						"target":anims.target});					
				}
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
	play()
	{
		for(let anims of this.animationRunning)
		{
			anims.play();
		}
		this.intervalo = window.setInterval(()=>
		{
			this.tiempo_segundo = this.animationRunning[0].currentTime/1000;
			document.querySelector("#currentTime").innerHTML = (this.tiempo_segundo.toFixed(2))+" s / <input id='MaximoTiempoInput' step='1' type='number' value='"+this.MaximoTiempo()+"' /> s";
			this.CargarControlTiempo();
			if((this.tiempo_segundo.toFixed(2)) >= this.MaximoTiempo())
			{
				this.tiempo_segundo = 0;
			}
			this.Tracker(this.tiempo_segundo);
		},10);
		this.playing = true;
	}
	pause()
	{
		for(let anims of this.animationRunning)
		{
			anims.pause();
		}
		clearInterval(this.intervalo);
		this.playing = false;
	}
	stop()
	{
		for(let anims of this.animationRunning)
		{
			anims.currentTime = 0;
			anims.pause();
		}
		clearInterval(this.intervalo);
		this.Tracker(0);
		this.playing = false;
	}
	getStyleModifierOfAnimation()
	{
		let res = [];
		for(let anims of this.animation)
			if(res.indexOf(anims.propertyName) == -1)
				res.push(anims.propertyName)
		return res;
	}
	CargarTracker()
	{
		document.querySelector("#slide-tracker").addEventListener("mousedown",()=>
		{
			document.body.onmousemove = (ev)=>
			{
				let x2 = (ev.clientX-175)+document.querySelector("#slidescroll").scrollLeft;
				if(x2 > 0)
					document.querySelector("#slide-tracker").style.left = x2+"px"
				this.ActualizarAnimacion((x2/151));
			}
			document.body.onmouseup = ()=>
			{
				document.body.onmousemove = null;
				document.body.onmouseup = null;
			}
		})
	}
	Tracker(sec,actualiza)
	{
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
			this.ActualizarAnimacion(sec);
	}
	ActualizarAnimacion(sec)
	{
		if(sec < 0)
			sec = 0;
		this.tiempo_segundo = sec;
		for(let anims of this.animationRunning)
		{
			anims.currentTime = sec*1000;
		}
		document.querySelector("#currentTime").innerHTML = (this.tiempo_segundo.toFixed(2))+" s / <input type='number' id='MaximoTiempoInput' step='1' value='"+this.MaximoTiempo()+"'/> s";
		this.CargarControlTiempo();
	}
	CambiarAnimacion(oldTime,start,end,elm)
	{
		let time = this.animationRunning[0].currentTime;
		this.animationRunning = [];
		for(let anims of this.animation)
		{
			let tag = elm.getAttribute("nodo").replace("target-","");
			if(anims.targetName.replace("#","").replace(".","") == tag)
			{
				if(anims.propertyName == elm.getAttribute("property"))
				{
					if(anims.startTime > oldTime-0.3 && anims.startTime < oldTime+0.3)
					{
						anims.startTime = Number(start.toFixed(2));
						anims.endTime = Number(end.toFixed(2));
					}
				}			
			}
		}
		this.CargarAnimacion();
		this.Tracker(time/1000,true);
	}
	ResizeAnimation(oldTime,start,duration,elm)
	{
		let time = this.animationRunning[0].currentTime;
		this.animationRunning = [];
		for(let anims of this.animation)
		{
			let tag = elm.getAttribute("nodo").replace("target-","");
			if(anims.targetName.replace("#","").replace(".","") == tag)
			{
				if(anims.propertyName == elm.getAttribute("property"))
				{
					if(anims.startTime > oldTime-0.3 && anims.startTime < oldTime+0.3)
					{
						anims.endTime = anims.startTime+Number(duration.toFixed(2));
					}
				}			
			}
		}
		this.CargarAnimacion();
		this.Tracker(time/1000,true);
	}
	MoverSlide(elm,event)
	{
		let x = event.clientX;
		let margen = Number(elm.style.marginLeft.replace("px",""));
		let posmargen = margen;
		let ancho = Number(elm.style.width.replace("px",""));
		elm.style.outline = "solid 2px #eee";
		document.body.onmousemove = (event)=>
		{
			let old = Number(elm.style.marginLeft.replace("px",""));
			let x2 = event.clientX;
			let xFinal = x2-x;

			let start = Number(elm.style.marginLeft.replace("px",""))/151;
			let end = (Number(elm.style.width.replace("px",""))+Number(elm.style.marginLeft.replace("px","")))/151;
			if(!event.ctrlKey)
			{
				if(old >= 0)
				{
					if(end < this.MaximoTiempo()+1)
					{
						if(margen+xFinal >= 0)
						{
							elm.style.marginLeft = (margen+xFinal)+"px";
							this.CambiarAnimacion(Number((posmargen/151).toFixed(2)),start,end,elm);	
							posmargen = Number(elm.style.marginLeft.replace("px",""));		
						}					
					}
				}				
			}else
			{
				if(end < this.MaximoTiempo())
				{
					elm.style.width = (ancho+xFinal)+"px"; 
					let resize = Number(elm.style.width.replace("px",""))/151
					this.ResizeAnimation(Number((posmargen/151).toFixed(2)),start,resize,elm);
				}
			}
		}
		document.body.onmouseup = ()=>
		{
			elm.style.outline = "none";
			document.body.onmousemove = null;
			document.body.onmouseup = null;
		}
	}
	addKeyframe(identificador,json,beginTo,duration)
	{
		let elm = document.querySelector(identificador);
		for(let key in json)
		{
			let newFrame = {};
			newFrame["startTime"] = beginTo;
			newFrame["endTime"] = beginTo+duration;
			newFrame["targetName"] = identificador;
			newFrame["target"] = elm.style;
			newFrame["propertyName"] = key;
			newFrame["startValue"] = "";
			newFrame["endValue"] = json[key];
			this.animation.push(newFrame);
		}
		this.refreshTimeline();
	}
	removeKeyframe(elmTimeline)
	{
		let segundo = Number(elmTimeline.style.marginLeft.replace("px",""))/151;
		let identificador = elmTimeline.getAttribute("nodo");
		let propiedad = elmTimeline.getAttribute("property");
		for(let clave in this.animation)
		{
			let anims = this.animation[clave];
			if(anims.targetName == identificador)
				if(anims.propertyName == propiedad)
					if(anims.startTime > segundo-0.3 && anims.startTime < segundo - 0.3)
						delete this.animation[clave];
		}
		this.CargarAnimacion();
		this.CargarLineasdeTiempo();
	}
	loadFile(dataString)
	{
	}
	refreshTimeline()
	{
		this.maxTime = (Number(this.MaximoTiempo()+1)>this.maxTime)?Number(this.MaximoTiempo()+1):this.maxTime;
		this.sortByNameAnimation();
		this.CargarTiempo();
		this.CargarLineasdeTiempo();
		this.CargarAnimacion();
	}
	CargarElmPrueba()
	{
		let estilo = document.createElement("style");
		let doc = document.createElement("div");
		doc.id = "test"
		doc.innerHTML = '<div id="elm65" class="default"></div><div id="elm85" class="default"></div><div id="elm105" class="default"></div>';
		estilo.innerHTML = ".default{position: relative;border:solid 1px black;width:50px; height: 50px;margin: 10px;}";
		if(document.querySelector("#test") == undefined)
		{
			document.body.appendChild(doc);
			document.head.appendChild(estilo);
		}
	};
}
let timelinecss = new Timeline();
timelinecss.Cargar([]);
