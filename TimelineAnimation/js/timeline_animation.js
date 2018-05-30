let maxTime = 12;
let animation = 
[
    {
        "startValue":"20",
        "endValue":"90",
        "startTime":1.25,
        "endTime":2.5,
        "propertyName":"left",
        "targetName":"div#elm65.default",
        "target":document.querySelector("#elm65").style
    },
    {
        "startValue":"0",
        "endValue":"50",
        "startTime":0,
        "endTime":1,
        "propertyName":"top",
        "targetName":"div#elm65.default",
        "target":document.querySelector("#elm65").style
    },
    {
        "startValue":"#fff",
        "endValue":"#333",
        "startTime":0.5,
        "endTime":1.5,
        "propertyName":"background-color",
        "targetName":"div#elm85.default",
        "target":document.querySelector("#elm85").style        
    },
    {
        "startValue":"0",
        "endValue":"80",
        "startTime":0,
        "endTime":1,
        "propertyName":"left",
        "targetName":"div#elm65.default",
        "target":document.querySelector("#elm65").style
    },
    {
        "startValue":"25",
        "endValue":"38",
        "startTime":2,
        "endTime":4,
        "propertyName":"top",
        "targetName":"div#elm85.default",
        "target":document.querySelector("#elm85").style
    },
    {
        "startValue":"0",
        "endValue":"50",
        "startTime":0,
        "endTime":1.5,
        "propertyName":"border-radius",
        "targetName":"div#elm85.default",
        "prefix":"px",
        "target":document.querySelector("#elm85").style
    }
];
CargarTimeline();
function CargarTimeline()
{
    if(localStorage.maxTime != undefined && localStorage.maxTime == "")
        maxTime = Number(localStorage.maxTime);
    CargarTiempo();
    sortAnimation();
    CargarLineasdeTiempo();
}
function CargarTiempo()
{
    let contenedor = document.querySelector("#timespan");
    for(let sec = 0;sec < maxTime;sec++)
    {
        let segundo = document.createElement("div");
        segundo.style.width="150px";
        segundo.style.height = "50%";
        segundo.style.display = "inline-block";
        segundo.style.verticalAlign = "top";
        segundo.style.borderRight = "solid 1px #555";
        contenedor.appendChild(segundo.cloneNode(true));
        let texto = document.createElement("span")
        texto.className = "sec";
        texto.innerHTML = (sec+1)+"s";
        contenedor.appendChild(texto);
    }
    document.querySelector("#line-container").style.width = (165*maxTime)+"px";
}
function sortAnimation()
{
    animation = animation.sort(function(a,b)
    {
        return (a.targetName.localeCompare(b.targetName)==0?(a.propertyName.localeCompare(b.propertyName)):(a.targetName.localeCompare(b.targetName)));
    });
}
function CargarLineasdeTiempo()
{
    let currentTarget = "";
    let sameTrack = "";
    for(let anims of animation)
    {
        //Cargamos el encabezado si procede
        if(currentTarget == "" || currentTarget != anims.targetName)
        {
            currentTarget =  anims.targetName;
            let parent = document.createElement("div");
            parent.id = "target-"+currentTarget.replace("#","").replace(".","");
            parent.innerHTML = "<label class='title'>"+currentTarget+"</label>";
            parent.style.height="28px";
            document.querySelector("#elements").appendChild(parent);
            sameTrack = "";
        }
        //Cargamos todos los hijos a quienes le corresponden un atributo en conccreto en la linea de tiempo
        if(sameTrack != anims.propertyName)
        {
            let children = document.createElement("div");
            children.className = "property";
            children.setAttribute("target-"+currentTarget.replace("#","").replace(".",""),"");
            children.style.height = "24px";
            children.innerHTML = "<label>"+anims.propertyName+"</label>";
            document.querySelector("#elements").appendChild(children);
            sameTrack = anims.propertyName;
            document.querySelector("#slide").appendChild(document.createElement("div"));
            //Creamos el track y añadimos el tiempo en el track del objeto JSON
            CrearTrackSlide(anims)
        }else
        {
            //Existe ya un track con esta propiedad asi que solo vamos a añadir el tiempo en el track que corresponde con el objeto
            CrearTrackSlide(anims)
        }
    }
}
function CrearTrackSlide(anims)
{
    let duration = anims.endTime-anims.startTime; 
    let color = ["#6C15C9","#1572C9","#c96c15","#7B0CE8","#FFF30D","#B26F00"];
    let timeSlide = document.createElement("div");
    timeSlide.style.width = (150 * duration) + "px";
    timeSlide.style.height = "24px";
    timeSlide.style.marginLeft = (150*anims.startTime)+"px";
    timeSlide.style.borderRadius = "10px";
    timeSlide.style.display="inline-block";
    timeSlide.style.verticalAlign = "top";
    timeSlide.style.marginRight = "10px";
    timeSlide.style.marginBottom = "5px";
    timeSlide.style.backgroundColor = color[parseInt((Math.random()*700)/100)]
    document.querySelector("#slide").appendChild(timeSlide);
}