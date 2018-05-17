var buildOption = {};
document.querySelector(".BasicTab").addEventListener("click", function()
{
	this.classList.add("selected");
	document.querySelector(".AdvancedTab").classList.remove("selected");
	document.querySelector(".BasicContainer").style.display = "block";
	document.querySelector(".AdvancedContainer").style.display = "none";
})