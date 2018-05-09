var numFrame = 0;
var duration = 0;
var totalDuration = 0;
var beginTo = 0;
var supressKeyFrame = false;
var elmSeleccionado = null;
var txtStyle = ["z-index","top","left","width","height","background-color","border-color","border-radius","font-size","color","font-weight","box-shadow","text-shadow","opacity","transform"];
function AnnadirFrame()
{
  // Recuperamos el puntero hacia el elemento DOM
  const webview = document.querySelector("#webview");
  beginTo = parseFloat((elmSeleccionado.getAttribute("termina")==undefined?0:elmSeleccionado.getAttribute("termina")))
  duration = parseFloat((elmSeleccionado.getAttribute("dura")==undefined)?0:1)
  localStorage.timeFrame = beginTo+";"+duration+";"+ elmSeleccionado.nodeName.toLowerCase()+"#"+elmSeleccionado.id+"."+elmSeleccionado.className;
  let AddWindow = new BrowserWindow(
    {
      width: 380, 
      height: 220,
      minWidth: 380,
      minHeight: 220,
      modal:true,
      icon:"img/logo-32.png",
      resizable:false,
      minimizable:false,
      parent:BrowserWindow.getAllWindows()[0],
      backgrounColor: "#333",
      nativeWindowOpen: true
    })
  AddWindow.loadURL(path.join(__dirname,"/newFrame.html"))
  AddWindow.setMenu(null);
  AddWindow.on('closed', function () {
    if(localStorage.timeFrame != "null")
    {
      // Recuperamos las variables
      var arr = localStorage.timeFrame.split(";");
      beginTo = parseFloat(arr[0]);
      duration = parseFloat(arr[1]);
       // Guardamos el estado del frame actual
      if(webview.innerHTML.trim() != "")
      {
        // Grabamos el objeto seleccionado en su movimiento
        obj = elmSeleccionado;
        let identificador = "div#"+obj.id+"."+obj.className;
        let json = {};
        for(let prop of txtStyle)
        {
          let valor = obj.style[prop];
            if(prop == "opacity")
              json[prop] = (prop!="opacity")?valor:(valor=="")?1:valor;
            else if(prop == "transform")
              json[prop] = (valor=="")?"rotate(0deg)":valor;
            else if(prop == "height")
              json[prop] = (valor=="")?Number(window.getComputedStyle(obj,null).getPropertyValue("height").replace("px","")):valor;
            else if(!isNaN(valor.replace("px","")))
              json[prop] = Number(valor.replace("px",""));
            else
              json[prop] = valor;
        }
        //Añadimos este frame como clave
        anim(identificador,obj.style,timelinegui).to(beginTo,json,duration);
        // Ponemos el timeline en pausa
        timelinegui.stop(beginTo+duration);
        // Sumamos uno al contador de Frame
        numFrame++;
        obj.setAttribute("termina",parseInt(arr[0]) + parseInt(arr[1]));
        obj.setAttribute("dura","true");
      }
      beginTo = parseInt(arr[0]) + parseInt(arr[1]);   
      duration = 1;
    }
    AddWindow = null
  })
}
function DelFrame()
{
  if(supressKeyFrame != false)
  {

  }
}