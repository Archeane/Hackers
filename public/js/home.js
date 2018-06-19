if(window.localStorage.permanentData){
        $('li.change').replaceWith(window.localStorage.permanentData);
    }

    //change DOM function
    function changeDom(){
        console.log("change dom");
        //ajax call
         $.ajax({
                  url: 'http://localhost:8080/change',
                  method:'POST',
                  data: {list: "some info"}
                }).done(function(data){
                    //if we have a successful post request ... 
                    if(data.success){
                        //change the DOM &
                        //set the data in local storage to persist upon page request
                        localStorage.setItem("permanentData", data.message);
                        var savedText = localStorage.getItem("permanentData");
                        $('li.change').replaceWith(savedText);

                        return;
                    }
                }).fail(function(){
                   //do nothing ....
                    console.log('failed...');
                    return;
                });
        };

    //trigger change DOM  function
    $('.trigger').click(function(){
        changeDom();
    });