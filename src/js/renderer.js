// Menu Renderer
let openedMenu = false;
let currentMenu = "";

window.addEventListener("load",function()
{
    let listLI = document.querySelectorAll(".top ul li");
    for(let li of listLI)
    {
        li.addEventListener("click",function()
        {
            let lista = document.querySelectorAll(".top ul li ul");
            let visible = this.querySelector("ul").style.display == "block";
            openedMenu = false;
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
})