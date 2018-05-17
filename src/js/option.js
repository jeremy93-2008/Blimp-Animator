var buildOption = {};
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
let btn_list = document.querySelectorAll(".sidebarElm div")
for(let btn of btn_list)
{
	btn.addEventListener("click", function()
	{
		for(let btn of btn_list)
		{
			btn.classList.remove("selected");
		}
		this.classList.add("selected");
	})
}
