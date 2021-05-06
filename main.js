var input_fields = null;

//Wait for the DOM tree to be loaded
(function() {
            console.log("Fetching bokeh content.")
            fetch('http://127.0.0.1:8000/plot').then(function (response){
              response.json().then(function (r){
                //console.log(r);
                window.Bokeh.embed.embed_item(JSON.parse(r), 'bokeh_frame').then(function(e){
                  // start listening to bokeh widget event after they have been loaded
                  init_listener();
                })
              });
            }).catch(function (e) {
              var plot = document.getElementById("bokeh_frame");
              plot.innerHTML = "Erreur côté serveur";
            });
})();

function init_listener(){
  console.log("Inititiate event listeners");
  input_fields = document.getElementsByTagName('input');
  console.log("Input HTML object:", input_fields);
  for (index = 0; index < input_fields.length; ++index) {
    // Would like to use input instead of change
    // so far we dump the whole block of widgets instead of only regenerating just the graphs...
    //input_fields[0].addEventListener("input", updatePlot);
    input_fields[index].addEventListener("change", updatePlot);
    // Place the cursor at the end of the input field when focus in on the input element
    input_fields[index].addEventListener('focus', function(){
        var that = this;
        setTimeout(function(){ that.selectionStart = that.selectionEnd = 10000; }, 0);
    });
  }
}

function updatePlot(e){
  console.log(e);
  var x;
  var params = "";
  //var coef = parseInt(input1[0].value);
  var url = "http://127.0.0.1:8000/plot";
  var name = "";
  var active_input = null;
  for (index = 0; index < input_fields.length; index++){
    const input = input_fields[index];
    console.log("name", input.name);
    x = input.value;
    console.log("x", x)
    // check if input field has focus to restore it later after regenarating content
    if(input === document.activeElement){
      active_input = input.name;
    }
    if(x !== null && x !== undefined){
      if(index > 0){
        params = params + "&"
      }
      name = "param" + index.toString();
//string.includes(substring)
      if(input.name !== undefined){
        if(input.name != ""){
          name = input.name
        }
      }
      params = params + name +"=" + x
    }
  }
  url = `${url}/?${params}`
  //var input1 = document.getElementsByName("input1");
  console.log("url", url)
  fetch(url).then(function (response){
    response.json().then(function (r){
      var plot = document.getElementById("bokeh_frame");
      if (r.detail === undefined) {
        plot.innerHTML = "";
        window.Bokeh.embed.embed_item(JSON.parse(r), 'bokeh_frame').then(function (views) {
          init_listener();
          // restore the focus on the last input field used
          if(active_input != null){
            document.getElementsByName(active_input)[0].focus();
          }
          //console.log(views);
        });
      } else {
        // plot.innerHTML = `Une erreur est survenue: ${JSON.stringify(r.detail)}`;
      }
    });
  });
}



