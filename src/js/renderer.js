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
    btnstay[0].className = "stay selected";
    const webview = document.querySelector("#webview")
    webview.addEventListener("click",function()
    {
        if(webview.innerHTML.trim() != "")
            InspectorEsconder(false);
    })
    const menuInspector = document.querySelectorAll(".inspector_menu button");
    for(let btn of menuInspector)
    {
        btn.addEventListener("click",function()
        {
            let btnS = this.parentNode.querySelectorAll("button");
            for(let btn of btnS)
            {
                let identificador = btn.id.replace("btn-","");
                btn.className = "";
                document.querySelector("#"+identificador).style.display = "none";
            }
            document.querySelector("#menu .right").style.display = (this.id.indexOf("inspector")!=-1?"block":"none")
            document.querySelector("#menu .right-elemento").style.display = (this.id.indexOf("outline")!=-1?"block":"none")
            document.querySelector("#menu .right-library").style.display = (this.id.indexOf("libreria")!=-1?"block":"none")
            let identificador = this.id.replace("btn-","");
            this.className = "selected";
            document.querySelector("#"+identificador).style.display = "block";
        })
    }
})