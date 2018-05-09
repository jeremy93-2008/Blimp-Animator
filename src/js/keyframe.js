var numFrame = 0;
var duration = 0;
var totalDuration = 0;
var beginTo = 0;
var supressKeyFrame = false;
var infoDel = "";
var elmSeleccionado = null;
var txtStyle = ["z-index","top","left","width","height","background-color","border-color","border-radius","font-size","color","font-weight","box-shadow","text-shadow","opacity","transform"];
function AnnadirFrame()
{
  if(elmSeleccionado!=null)
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
        nativeWindowOpen: true,
        show:false
      })
    AddWindow.webContents.on('did-finish-load', function() {
        AddWindow.show();
    });
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
                json[prop] = (valor=="")?devolverNumeroTexto(obj,prop):Number(valor.replace("px",""));
              else if(valor == "black")
                json[prop] = "rgb(0,0,0)";
              else if(valor == "" && prop.indexOf("-shadow") != -1)
                json[prop] = "black 0px 0px 0px";
              else if(valor != "" && prop.indexOf("-shadow") != -1)
                json[prop] = valor;
              else if(valor == "" && prop == "z-index")
                json[prop] = 0;
              else if(valor == "" && prop == "font-weight")
                json[prop] = 400;                
              else if(valor == "")
                json[prop] = devolverNumeroTexto(obj,prop);
              else if(valor.indexOf("px") != -1)
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
  }else
  {
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
    {
        "title":"Información",
        "type":"info",
        "buttons":["OK"],
        "defaultId":0,
        "cancelId":2,
        "noLink":true,
        "message":"No se ha seleccionado ningún elemento para crear el fotograma clave."
    });
  }
}
function devolverNumeroTexto(obj,prop)
{
  let b = window.getComputedStyle(obj,null).getPropertyValue(prop);
  b = b.replace("px","");
  if(isNaN(b))
    return b
  else
    return Number(b)
}
function DelFrame()
{
  let self = timelinegui;
  if(supressKeyFrame)
  {
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
            {
                "title":"Atención",
                "type":"warning",
                "buttons":["Sí","No","Cancelar"],
                "defaultId":0,
                "cancelId":2,
                "noLink":true,
                "message":"¿Está seguro que desea borrar esta animación? \n"+infoDel
            },function(num)
            {
              if(num==0)
              {
                let list = self.selectedKeys[0].track.parent.propertyTracks;
                self.selectedKeys = list;
                self.deleteSelectedKeys();
                self.rebuildSelectedTracks();
                self.hideKeyEditDialog();
              }
            });
  }else
  {
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0],
    {
        "title":"Información",
        "type":"info",
        "buttons":["OK"],
        "defaultId":0,
        "cancelId":2,
        "noLink":true,
        "message":"No se ha seleccionado ningún fotograma clave para su eliminación."
    });
  }
}
