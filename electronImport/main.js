const { app } = require('electron');
const Window = require('./Window');
const fs = require('fs');

function main(){
    let mainWinow = new Window({
        file: 'index.html'
    });
}
app.on('ready', main);
app.on('window-all-closed', function(){
    app.quit();
})