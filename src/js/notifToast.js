/**
	Notification Toast (c) 2018 Jeremy Auvray
	**-----------------------------------------------------------------**
	notifToast is a Javascript/CSS library for non-blocking notifications.
*/

// Queue NotifToast Array
window.notifQueue = [];
// History Array
window.notifHistoryList = [];

function notifToast(JsonText)
{	
	// JSON Object 
	this.json = JsonText;
	
	// Default Object with JSON Custom Configuration
	if(typeof this.json != "object")
		this.json = {};
	if(this.json.duration == 0)
		this.json.duration = -1;
	
	//Duration is a string, change it in number, and multiply it by 1000
	if(typeof this.json.duration == "string")
		this.json.duration = parseFloat(this.json.duration.replace(" s","").replace("s",""))*1000;
	
	this.message = this.json.message || "";
	this.title = this.json.title || "";
	this.icon = this.json.icon || false;
	this.duration = this.json.duration || 5000;
	this.position = this.json.position || "top";
	this.layout = this.json.layout || "fixed";
	this.closeButton = this.json.closeButton || false;
	this.animationIn = this.json.animationIn || "slide";
	this.animationOut = this.json.animationOut || "slide"; // Toggle, Fade, Slide, Flip, Zoom
	this.fontTitle = this.json.fontTitle || "";
	this.fontMessage = this.json.fontMessage || "";
	this.colorTitle = this.json.colorTitle || "";
	this.colorMessage = this.json.colorMessage || "";
	this.historyButton = this.json.historyButton || false;
	this.historyButtonPosition = this.json.historyButtonPosition || "topleft";
	this.historyPanelPosition = this.json.historyPanelPosition || "left";
	this.historyPanelTitle = this.json.historyPanelTitle || "Notification Center";
	this.historyPanelCloseTooltip = this.json.historyPanelCloseTooltip || "Delete all notification and close it";
	this.id = this.json.id || ("Toast"+parseInt(Math.random()*1000));
}

/**
	Different Color Scheme Toast Notification for Information, Warning, Error and Success
*/

notifToast.prototype.showInfo = function(customMessage,customTitle)
{
	this.type = "info";
	this._private_positionCss();
	let cont = this._private_buildNotif(customMessage,customTitle);
	let effect_anim = this._private_EffectAnimation();
	
	if(this.icon)
		cont.innerHTML = cont.innerHTML.replace("#ICON#","<i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i>");
	else
		cont.innerHTML = cont.innerHTML.replace("#ICON#","");
	
	// Here, the Style Class of this type of Toast, you can modify the text between quote and replace by your own classes, but don't change the keyword class of the first quote group
	cont.setAttribute("class","notif notifInfo "+effect_anim);
	
	this._private_showNotif(cont);
};
notifToast.prototype.showWarning = function(customMessage,customTitle)
{
	this.type = "warning";
	this._private_positionCss();
	let cont = this._private_buildNotif(customMessage,customTitle);
	let effect_anim = this._private_EffectAnimation();
	
	if(this.icon)
		cont.innerHTML = cont.innerHTML.replace("#ICON#","<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>");
	else
		cont.innerHTML = cont.innerHTML.replace("#ICON#","");
	
	// Here, the Style Class of this type of Toast, you can modify the text between quote and replace by your own classes, but don't change the keyword class of the first quote group
	cont.setAttribute("class","notif notifWarn "+effect_anim);
	
	this._private_showNotif(cont);
};
notifToast.prototype.showError = function(customMessage,customTitle)
{
	this.type = "error";
	this._private_positionCss();
	let cont = this._private_buildNotif(customMessage,customTitle);
	let effect_anim = this._private_EffectAnimation();
	
	if(this.icon)
		cont.innerHTML = cont.innerHTML.replace("#ICON#","<i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i>");
	else
		cont.innerHTML = cont.innerHTML.replace("#ICON#","");
	
	// Here, the Style Class of this type of Toast, you can modify the text between quote and replace by your own classes, but don't change the keyword class of the first quote group
	cont.setAttribute("class","notif notifErr "+effect_anim);
	
	this._private_showNotif(cont);
};
notifToast.prototype.showSuccess = function(customMessage,customTitle)
{
	this.type = "success";
	this._private_positionCss();
	let cont = this._private_buildNotif(customMessage,customTitle);
	let effect_anim = this._private_EffectAnimation();

	if(this.icon)
		cont.innerHTML = cont.innerHTML.replace("#ICON#","<i class=\"fa fa-check-circle-o\" aria-hidden=\"true\"></i>");
	else
		cont.innerHTML = cont.innerHTML.replace("#ICON#","");
	
	// Here, the Style Class of this type of Toast, you can modify the text between quote and replace by your own classes, but don't change the keyword class of the first quote group
	cont.setAttribute("class","notif notifSucc "+effect_anim);
	
	this._private_showNotif(cont);
};

/**
	Private Function used in internal procedure for the correct work of library.
	It's recommended to not modify it
*/

notifToast.prototype._private_buildNotif = function(customMessage,customTitle)
{
	var closeButt = (this.closeButton)?"<div class='closeButton'>X</div>":"";
	var cont = document.createElement("div");
	cont.setAttribute("id",this.id);
	cont.setAttribute("style","position:"+this.layout+";"+this.positionCss);
	if(customMessage != undefined)
		this.message = customMessage;
	if(customTitle != undefined)
		this.title = customTitle
	cont.innerHTML = "#ICON#<div class='notifText'><h4 style='font:"+this.fontTitle+";color:"+this.colorTitle+";'>"+this.title+"</h4>"+closeButt+
	"<div style='font:"+this.fontMessage+";color:"+this.colorMessage+";'>"+this.message+"</div></div>";
	return cont;
}

notifToast.prototype._private_loadInstance = function(that)
{
	this.message = that.message;
	this.title = that.title;
	this.icon = that.icon;
	this.duration = that.duration;
	this.position = that.position;
	this.layout = that.layout;
	this.closeButton = that.closeButton;
	this.animationIn = that.animationIn;
	this.animationOut = that.animationOut;
	this.fontTitle = that.fontTitle;
	this.fontMessage = that.fontMessage;
	this.colorTitle = that.colorTitle;
	this.colorMessage = that.colorMessage;
	this.id = that.id;
	this.type = that.type;
	this.historyButton = that.historyButton;
	this.historyButtonPosition = that.historyButtonPosition;
	this.historyPanelPosition = that.historyPanelPosition;
	this.historyPanelTitle = that.historyPanelTitle;
	this.historyPanelCloseTooltip = that.historyPanelCloseTooltip;
}

notifToast.prototype._private_showNotif = function(cont)
{	
	let list_notif = document.querySelectorAll(".notif");
	if(list_notif.length > 0 || window.notifHistoryList.length > 0)
		this._private_showHistoryButton();
	if(list_notif.length > 0 && this.duration > -1)
	{
		// Add current notif in Queue Array
		window.notifQueue.push(JSON.parse(JSON.stringify(this)));		
	}else
	{
		// Add notif in History Array
		window.notifHistoryList.unshift(JSON.parse(JSON.stringify(this)));
		// Refresh History Panel if opened
		let hist = document.querySelector(".notifHistoryPanel");
		if(hist != undefined)
		{
			this._internal_showHistoryPanel();
			this._internal_showHistoryPanel();
		}
		if(list_notif.length > 0 && this.duration == -1)
			document.querySelector(".notif").remove();
		this._private_internalNotif(cont);
	}
}
notifToast.prototype._private_internalNotif = function(cont,that)
{
	if(that == undefined)
		that = this;
	document.body.appendChild(cont);
	var out = that.animationOut;
	if(that.duration > 0){
		this.tempo = window.setTimeout(function()
		{
			// Select One Out Animation from the option written in the JSON Config
			let classes = cont.getAttribute("class");
			let timeWaiting = 1100;
			switch(out)
			{
				case "fade": 
					cont.setAttribute("class",classes+" fade_hide");
				break;
				case "flip": 
					cont.setAttribute("class",classes+" flip_hide");
				break;
				case "slide": 
					cont.setAttribute("class",classes+" slide_hide");
					timeWaiting = 500;
				break;
				case "zoom": 
					cont.setAttribute("class",classes+" zoom_hide");
					timeWaiting = 500;
				break;
				default: 
					cont.setAttribute("class",classes+" toggle_hide");
				break;
			}
			// Garbage Collector after the Out effect
			window.setTimeout(function()
			{
				let list_notif = document.querySelectorAll(".notif");
				for(let a = 0;a < list_notif.length;a++)
				{
					list_notif[a].remove();
				}
				// When the old notification disappear and had some notif in Queue, it's display the first one
				if(window.notifQueue.length >= 1)
				{
					let toast = new notifToast();
					toast._private_loadInstance(window.notifQueue.shift());
					switch(toast.type)
					{
						case "info":toast.showInfo();break;
						case "warning":toast.showWarning();break;
						case "error":toast.showError();break;
						case "success":toast.showSuccess();break;
					}
				}
			},timeWaiting);
		},that.duration,[cont,out]);
	}
	cont.querySelector(".closeButton").addEventListener("click",function()
	{
		this.parentNode.parentNode.remove();
	});
}
notifToast.prototype._private_showHistoryButton = function()
{
	let menu = document.querySelector(".notifHistoryButton");
	if(this.historyButton && menu == undefined)
	{
		let wrapButt = document.createElement("div");
		wrapButt.setAttribute("class","notifHistoryButton");
		wrapButt.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
		switch(this.historyButtonPosition.toLowerCase())
		{
			case "topright":wrapButt.setAttribute("style","left:initial;right:5;");break;
			case "bottomleft":wrapButt.setAttribute("style","top:initial;bottom:5;");break;
			case "bottomright":wrapButt.setAttribute("style","top:initial;bottom:5;right:5;");break;
			case "topcenter":wrapButt.setAttribute("style","left: 47%;");break;
			case "bottomcenter":wrapButt.setAttribute("style","top:initial;bottom:5;left: 47%;");break;
		}
		wrapButt.addEventListener("click",function()
		{
			let t = new notifToast();
			t._internal_showHistoryPanel(true);
		});
		document.body.appendChild(wrapButt);
	}
}
notifToast.prototype._private_positionCss = function()
{
	switch(this.position)
	{
		case "top": this.positionCss = "top:0;left:0;width:100%;border-bottom:solid 1px #aaa;"; break;
		case "bottom":  this.positionCss = "bottom:0;left:0;width:100%;border-top:solid 1px #aaa;"; break;
		default: this.positionCss = ""; break;
	}
}
notifToast.prototype._private_EffectAnimation = function()
{
	switch(this.animationIn)
	{
		case "fade": return "fade_start fade_show";
		case "slide": return "slide_start slide_show";
		case "flip": return "flip_start flip_show";
		case "zoom": return "zoom_start zoom_show";
		default: return "";
	}
}
notifToast.prototype._internal_showHistoryPanel = function(animationPanel)
{
	let hist = document.querySelector(".notifHistoryPanel");
	if(hist == undefined)
	{
		let wrapHist = document.createElement("div");
		if(animationPanel)
			wrapHist.setAttribute("class","notifHistoryPanel animationBeginHistoryPanel");
		else
			wrapHist.setAttribute("class","notifHistoryPanel");
		
		this._private_loadInstance(window.notifHistoryList[0]);
		if(this.historyPanelPosition == "right")
		{
			wrapHist.setAttribute("style",'left:initial;right:0;border-left:initial;border-right:solid 1px lightgray;');
		}
		let html = "<div class='topHistory'><h3>"+this.historyPanelTitle+"</h3><div class='closeHist' title='"+this.historyPanelCloseTooltip+"'>X</div></div><div class='histDetail'>";
		for(let a = 0;a < window.notifHistoryList.length;a++)
		{
			this._private_loadInstance(window.notifHistoryList[a]);
			let inHTML = "";
			if(a == 0 && animationPanel == undefined)
				inHTML = "<div orden='"+a+"' targetid='"+this.id+"' class='histNotif histNotifanimationNew'>"+this._private_buildNotif().innerHTML+"</div>";
			else
				inHTML = "<div orden='"+a+"' targetid='"+this.id+"' class='histNotif'>"+this._private_buildNotif().innerHTML+"</div>";
			switch(this.type)
			{
				case "info": inHTML = inHTML.replace("#ICON#","<i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i>").replace(/class='histNotif/g,"class='histNotif histInfo ");break;
				case "warning": inHTML = inHTML.replace("#ICON#","<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>").replace(/class='histNotif/g,"class='histNotif histWarning ");break;
				case "error": inHTML = inHTML.replace("#ICON#","<i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i>").replace(/class='histNotif/g,"class='histNotif histError ");break;
				case "success": inHTML = inHTML.replace("#ICON#","<i class=\"fa fa-check-circle-o\" aria-hidden=\"true\"></i>").replace(/class='histNotif/g,"class='histNotif histSuccess ");break;
			}
			html += inHTML;
		}
		wrapHist.innerHTML = html+"</div>";
		document.body.appendChild(wrapHist);
		
		// Attach Event for Close History Notifications button, to delete them.
		let closeHist = document.querySelectorAll(".histDetail .closeButton");
		for(let a = 0;a < closeHist.length;a++)
		{
			closeHist[a].addEventListener("click",function()
			{
				let num = this.parentNode.parentNode.getAttribute("orden");
				window.notifHistoryList.splice(parseInt(num),1);
				let t = new notifToast();
				t._internal_showHistoryPanel(false);
				if(window.notifHistoryList.length >= 1)
					t._internal_showHistoryPanel(false);
				else
					document.querySelector(".notifHistoryButton").remove();
			});
		}
		
		// Attach Event to Erase All Notification and close notification panel
		let eraseHist = document.querySelector(".closeHist");
		eraseHist.addEventListener("click",function()
		{
			let t = new notifToast();
			t._internal_showHistoryPanel(false);
		});
	}else
	{
		hist.remove();
	}
}