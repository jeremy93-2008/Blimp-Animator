// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
module.exports =
{
    Hola: function()
    {
        dialog.showMessageBox({
            type:"info",
            title:"Hola!",
            message:"Esto es un mensaje"
        });
    }
} 