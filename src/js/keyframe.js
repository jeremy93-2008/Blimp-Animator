var numFrame = 0;
var duration = 0;
var totalDuration = 0;
var beginTo = 0;
var keyframes = [];
var txtStyle = ["z-index","top","left","width","height","background-color","border-color","border-radius","font-size","color","font-weight","box-shadow","text-shadow","opacity","transform"];
function AnnadirFrame()
{
  // Recuperamos el puntero hacia el elemento DOM
  const webview = document.querySelector("#webview");
  // Guardamos el estado del frame actual
  if(webview.innerHTML.trim() != "")
  {
    // Se recupera el contenido completo de WebView y se guarda en un fotograma clave, y se hace una copia de valor
    keyframes[numFrame] = webview.cloneNode(true);
    // Si el fotograma a grabar es el primero, grabamos todas las propiedades susceptibles de generar un cambio, esa es la lista del inspector y los eventos de ratón, en la timeline
    for(let obj of webview.querySelectorAll("*"))
    {
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
      // Ponemos el timeline en pausa
      timelinegui.stop();
      //Añadimos este frame como clave
      anim(identificador,obj.style,timelinegui).to(beginTo,json,duration);
    }
    // Sumamos uno al contador de Frame
    numFrame++;
  }
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
    }
    AddWindow = null
  })

}