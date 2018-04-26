//remote.BrowserWindow.getAllWindows()[0].getSize() [640,480]
const {remote,clipboard} = require("electron");
const dialog = remote.dialog;
const fs = require("fs");
const vue = require("vue");
let openedMenu = false;

window.addEventListener("load",function()
{
    document.querySelector(".top ul").addEventListener("mouseleave",function()
    {
        var evento = function()
        {
            if(this.nodeName != "LI")
            {
                let lista = document.querySelectorAll(".top ul li ul");
                for(let item of lista)
                {
                    item.parentNode.className = "";
                    item.style.display = "none";
                }
                openedMenu = false;
                window.removeEventListener("click",evento,false);
            }
        }
        window.addEventListener("click",evento);
    })
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
                    }   
            }
        })
        li.addEventListener("mouseenter",function()
        {
            let lista = document.querySelectorAll(".top ul li ul");
            let visible = this.querySelector("ul").style.display == "block";
            if(openedMenu)
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
                        }   
                }
            }
        })
    }
})