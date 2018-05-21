let buildAnimOption = {};
const defaultAnimOption = 
{
	"ease":"linear",
	"delay":0,
	"iteration-count":"infinite",
	"direction":"normal",
	"fill-mode":"none",
	"moreCode":""
};
const div = document.querySelector(".sidebarElm");
let eachElm = localStorage.eachElm;
let a = 0;
for(let obj of eachElm.split(";"))
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
		if(a==0)
			cont.classList.add("selected");
		document.getElementById("animation").style.display = "none";
		document.getElementById("general").style.display = "block";	
	}

	a++;
}
document.querySelector(".BasicTab").addEventListener("click", function()
{
	this.classList.add("selected");
	this.style.zIndex = 1;
	document.querySelector(".AdvancedTab").classList.remove("selected");
	document.querySelector(".AdvancedTab").style.zIndex = 2
	document.querySelector(".BasicContainer").style.display = "block";
	document.querySelector(".AdvancedContainer").style.display = "none";
})
document.querySelector(".AdvancedTab").addEventListener("click", function()
{
	this.classList.add("selected");
	this.style.zIndex = 2;
	document.querySelector(".BasicTab").style.zIndex = 1
	document.querySelector(".BasicTab").classList.remove("selected");
	document.querySelector(".AdvancedContainer").style.display = "block";
	document.querySelector(".BasicContainer").style.display = "none";
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
					opt.value = buildAnimOption[btn.getAttribute("identificador")][opt.id]
				}
			}
		}
		this.classList.add("selected");
	})
}
document.querySelector("#guardar").addEventListener("click",function()
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
})