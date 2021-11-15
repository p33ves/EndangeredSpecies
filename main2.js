var _data;

/**
 * Do the following when the browser window loads
 */
window.onload = function(){
    console.log("Hello World!");
    loadData("heirarchy.json");
};

function loadData(path){
    d3.json(path).then( function(data){
        console.log(data);
        _data = data;

        // drawCountries(_data);
        // drawBars(_data);
    });
}