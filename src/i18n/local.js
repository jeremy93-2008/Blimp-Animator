//readJsonSync [en,fr]
let default_lang = "en";
let json = "";
if(localStorage.lang != undefined && localStorage.lang != "")
{
	default_lang = localStorage.lang;
}
try
{
	json = extra.readJsonSync(__dirname+"/i18n/trad/"+default_lang+".json");
}catch(ex)
{
	extra = require("fs-extra");
	json = extra.readJsonSync(__dirname+"/i18n/trad/"+default_lang+".json");
}
function getLang()
{
	return default_lang;
}
function setLang(s)
{
	if(s=="es" || s=="en" || s == "fr")
	{
		default_lang = s;
		reloadJSON();
	}
}
function Geti18n()
{
	//Look after span, attr=title and button
	let lista_span = document.querySelectorAll("body span,body button,body option,body label,body td");
	for(let span of lista_span)
	{
		let clave = span.innerHTML.trim();
		if(json[clave] != undefined)
			span.innerHTML = json[clave]
		if(span.getAttribute("title") != null)
		{
			clave = span.getAttribute("title").trim();
			if(json[clave] != undefined)
				span.setAttribute("title",json[clave])
		}
	}
}
function Geti18nForElm(elm)
{
	let lista_span = elm.querySelectorAll("body span,body button,body option,body label,body td");
	for(let span of lista_span)
	{
		let clave = span.innerHTML.trim();
		if(json[clave] != undefined)
			span.innerHTML = json[clave]
		if(span.getAttribute("title") != null)
		{
			clave = span.getAttribute("title").trim();
			if(json[clave] != undefined)
				span.setAttribute("title",json[clave])
		}		
	}
}
function reloadJSON()
{
	json = extra.readJsonSync(__dirname+"/i18n/trad/"+default_lang+".json");
}
function $_(clave)
{
	GetSpecificTrad(clave);
}
function GetSpecificTrad(clave)
{
	return json[clave];
}
Geti18n()