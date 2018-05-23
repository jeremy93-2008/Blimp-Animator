const defaultAnimOption = 
{
	"timing-function":"linear",
	"delay":0,
	"iteration-count":"infinite",
	"direction":"normal",
	"fill-mode":"none",
	"moreCode":""
};
let buildAnimOption = (localStorage.animation == undefined || localStorage.animation == "")?defaultAnimOption:JSON.parse(localStorage.animation);
const div = document.querySelector(".sidebarElm");
let eachElm = localStorage.eachElm;
let a = 0;
let hayElm = false;
let Toast = new notifToast(
	{"message":"Los datos se han guardado correctamente",
	"fontTitle":"bold italic 15px arial",
	"duration":3000,
	"fontMessage":"12px arial",
	"icon":true,
	"closeButton":true});
if(eachElm.indexOf(";") != -1)
{
	for(let obj of eachElm.split(";"))
	{
		if(obj != "")
		{
			let cont = document.createElement("div");
			cont.innerHTML = obj;
			cont.setAttribute("identificador",obj);
			div.appendChild(cont);
			if(localStorage.option == "animation")
			{
				if(a==0)
					cont.classList.add("selected");
				document.getElementById("animation").style.display = "block";
				document.getElementById("general").style.display = "none";	
			}else
			{
				document.querySelector(".sidebarElm div").classList.add("selected");
				document.getElementById("animation").style.display = "none";
				document.getElementById("general").style.display = "block";	
			}
			hayElm = true;
			a++;
		}
	}
}
if(!hayElm)
{
	document.querySelector(".sidebarElm div").classList.add("selected");
	document.getElementById("animation").style.display = "none";
	document.getElementById("general").style.display = "block";	
	Toast.showWarning("No hay elemento que mostrar.")	
}
document.querySelector(".BasicTab").addEventListener("click", function()
{
	this.classList.add("selected");
	this.style.zIndex = 1;
	document.querySelector(".AdvancedTab").classList.remove("selected");
	document.querySelector(".AdvancedTab").style.zIndex = 2
	document.querySelector(".sidebarElm").style.transform = "translatex(0px)";
	document.querySelector(".BasicContainer").style.display = "block";
	document.querySelector(".AdvancedContainer").style.display = "none";
})
let firstTime = false;
document.querySelector(".AdvancedTab").addEventListener("click", function()
{
	this.classList.add("selected");
	this.style.zIndex = 2;
	document.querySelector(".BasicTab").style.zIndex = 1
	document.querySelector(".sidebarElm").style.transform = "translatex(-250px)";
	document.querySelector(".BasicTab").classList.remove("selected");
	document.querySelector(".AdvancedContainer").style.display = "block";
	document.querySelector(".BasicContainer").style.display = "none";
	if(!firstTime)
		LoadMonaco();
})
document.querySelector(".check").addEventListener("click",function(evt)
{
	if(this.checked == true){
		document.querySelector("#iteration-count").disabled = true;
		document.querySelector("#iteration-count").setAttribute("second","");
		this.removeAttribute("second");
	}else{
		document.querySelector("#iteration-count").disabled = false;
		document.querySelector("#iteration-count").removeAttribute("second");
		this.setAttribute("second","");
	}
})
let btn_list = document.querySelectorAll(".sidebarElm div")
for(let btn of btn_list)
{
	btn.addEventListener("click", function()
	{
		for(let btn of btn_list)
		{
			btn.classList.remove("selected");
		}
		document.getElementById("animation").style.display = "block";
		document.getElementById("general").style.display = "none";	
		if(btn.innerHTML.trim() == "General")
		{
			document.getElementById("animation").style.display = "none";
			document.getElementById("general").style.display = "block";				
		}else
		{
			if(buildAnimOption[btn.getAttribute("identificador")] == undefined)
			{
				let lista_opt = document.querySelectorAll(".opt")
				for(let opt of lista_opt)
				{
					opt.value = defaultAnimOption[opt.id]
					if(opt.id == "iteration-count")
						opt.value = 0;
				}
			}else
			{
				let lista_opt = document.querySelectorAll(".opt")
				for(let opt of lista_opt)
				{
					if(opt.getAttribute("type") == "checkbox" && buildAnimOption[btn.getAttribute("identificador")]["iteration-count"] == "infinite")
						opt.checked = true;
					else
						opt.checked = false;
					let valor = buildAnimOption[btn.getAttribute("identificador")][opt.id];
					opt.value = valor;
				}
			}
		}
		this.classList.add("selected");
	})
	if(btn.className.indexOf("selected") != -1)
	{
		if(buildAnimOption[btn.getAttribute("identificador")] == undefined)
		{
			let lista_opt = document.querySelectorAll(".opt")
			for(let opt of lista_opt)
			{
				opt.value = defaultAnimOption[opt.id]
				if(opt.id == "iteration-count")
					opt.value = 0;
			}
		}else
		{
			let lista_opt = document.querySelectorAll(".opt")
			for(let opt of lista_opt)
			{
				if(opt.getAttribute("type") == "checkbox" && buildAnimOption[btn.getAttribute("identificador")]["iteration-count"] == "infinite")
					opt.checked = true;
				else
					opt.checked = false;
				let valor = buildAnimOption[btn.getAttribute("identificador")][opt.id];
				opt.value = valor;
			}
		}
	}
}
document.querySelector("#save").addEventListener("click",function()
{
	let elm = document.querySelector(".sidebarElm .selected").getAttribute("identificador")
	let lista_opt = document.querySelectorAll(".opt")
	buildAnimOption[elm] = JSON.parse(JSON.stringify(defaultAnimOption));
	for(let opt of lista_opt)
	{
		if(opt.getAttribute("type") == "checkbox" && opt.checked)
			buildAnimOption[elm]["iteration-count"] = "infinite";
		else
			if(opt.id != "")
				buildAnimOption[elm][opt.id] = opt.value;
	}
	(new Storage("animation")).setData(buildAnimOption);
	Toast.showSuccess("Los datos se han guardado correctamente.","");
})
let defaultBinding = 
{
	"Cortar":"ctrl+x",
	"Copiar":"ctrl+c",
	"Pegar":"ctrl+v",
	"DelBlimp":"delete",
	"PegarSoloEstilo":"ctrl+alt+v",
	"Deshacer":"ctrl+z",
	"Rehacer":"ctrl+y",
	"Construir":"f5",
	"Reproducir":"f10",
	"Jugar":"space",
	"AddFrame":"ctrl+f",
	"NuevoArchivo":"ctrl+n",
	"Guardar":"ctrl+s",
	"AbrirArchivo":"ctrl+o",
	"Cerrar":"ctrl+w",
	"Opciones":"ctrl+p",
	"Ayuda":"f1",
	"BuscarActualizaciones":"ctrl+f8"
}
let tableBinding = (localStorage.tableBinding == undefined)?defaultBinding:JSON.parse(localStorage.tableBinding);
document.querySelectorAll(".subKey").forEach(function(elm)
{
	elm.value = tableBinding[elm.id];
	elm.addEventListener("keydown",function(evt)
	{
		let txt = "";
		if(evt.ctrlKey)
			txt += "ctrl+"
		if(evt.altKey)
			txt += "alt+"
		if(evt.shiftKey)
			txt += "shift+"
		txt += evt.key;
		if(evt.key != "Control" && evt.key != "Alt" && evt.key != "Shift" && evt.key != "Meta" && evt.key != "Backspace" && evt.key != "AltGraph" && evt.key != "Enter")
		{
			this.value = txt.toLowerCase();
			tableBinding[elm.id] = this.value;
			localStorage.tableBinding = JSON.stringify(tableBinding);
			console.log(defaultBinding);
		}
			
		evt.preventDefault();
	})
});
function restablecer()
{
	tableBinding = defaultBinding;
	localStorage.tableBinding = JSON.stringify(tableBinding);
	document.querySelectorAll(".subKey").forEach(function(elm)
	{
		elm.value = tableBinding[elm.id];
	});	
}