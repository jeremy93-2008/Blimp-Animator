/*var rect = {
    x: 50,
    y: 50,
    opacity: 1,
    width: 40,
    height: 40,
    rotation: 0
  };*/
//anim("rect",rect).to({"x":20},0).to({"x":110},1, Timeline.Easing.Bounce.EaseOut).to({"x":20},1, Timeline.Easing.Cubic.EaseOut);
//anim("rect",rect).to({"rotation":0},0).to({"rotation":3.14},0.99);
//-----
//
//anim("rect2",rect2).to({"y":50},0).to({"y":50},0.33).to({"y":100},1.19);
//anim("rect2",rect2).to({"height":40},0).to({"height":40},0.34).to({"height":300},1.2);
//anim(identificador,elm.style,timelinegui).to(0,{"width":Number(keyframes[numFrame][identificador]["width"].replace("px",""))},0.2).to(1,{"width":250},0.3);
//keyframes[numFrame][identificador] = ConvertNodetoJSON(elm);
var numFrame = 0;
var keyframes = [];
function CrearKeyFrame()
{
  // Recuperamos el puntero hacia el elemento DOM
  const webview = document.querySelector("#webview");
  // Se recupera el contenido completo de WebView y se guarda en un fotograma clave, y se hace una copia de valor
  keyframes[numFrame] = webview.cloneNode(true);
  // Si el fotograma a grabar es el primero, grabamos todas las propiedades susceptibles de generar un cambio, esa es la lista CSS

}

function ConvertNodetoJSON(elm)
{
  let json = [];
  let CSSProp = window.getComputedStyle(elm,null);
  for(rule of CSSProp)
  {
    json[rule] = CSSProp.getPropertyValue(rule);
  }
  return json;
}