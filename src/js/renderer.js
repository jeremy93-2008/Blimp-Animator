// Menu Renderer
let openedMenu = false;
let currentMenu = "";

window.addEventListener("load",function()
{
    let listLI = document.querySelectorAll(".top ul li");
    for(let li of listLI)
    {
        li.addEventListener("click",function(ev)
        {
            let lista = document.querySelectorAll(".top ul li ul");
            let insideMenu = true;
            let visible = false;
            if(this.querySelector("ul") != undefined)
            {
                visible = this.querySelector("ul").style.display == "block";
                openedMenu = false;
                insideMenu = false;
            }
            for(let item of lista)
            {
                item.parentNode.className = "";
                item.style.display = "none";
                if(item == this.querySelector("ul"))
                    if(!insideMenu && !visible)
                    {
                        this.querySelector("ul").style.display="block";
                        this.className = "selected";
                        openedMenu = true;
                        currentMenu = this;
                    }   
            }
            ev.stopPropagation();
        })
        li.addEventListener("mouseenter",function()
        {
            let lista = document.querySelectorAll(".top ul li ul");
            let visible = this.querySelector("ul")!=undefined?this.querySelector("ul").style.display == "block":false;
            if(openedMenu && !(currentMenu.contains(this)))
            {
                for(let item of lista)
                {
                    item.parentNode.className = "";
                    item.style.display = "none";
                    if(item == this.querySelector("ul"))
                        if(!visible)
                        {
                            this.querySelector("ul").style.display="block";
                            this.className = "selected";
                            openedMenu = true;
                            currentMenu = this;
                        }   
                }
            }
        })
    }
    let btnstay = document.querySelectorAll("button.stay");
    for(let item of btnstay)
    {
        item.addEventListener("click",function()
        {
            for(let btn of btnstay)
            {
                btn.className = "stay";
            }
            this.className = "stay selected";
        })
    }
    const webview = document.querySelector("#webview")
    webview.addEventListener("click",function()
    {
        if(webview.innerHTML.trim() != "")
            InspectorEsconder(false);
    })
})