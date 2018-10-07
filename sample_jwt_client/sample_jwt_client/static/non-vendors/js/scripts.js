$(document).ready(function() { 

    // NOTE: I combined every javascript, but on bigger applications
    //  its better if its all different 

    // This attachs a csrf token on the ajax request!
    //    This came form the django docs itself.
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        var csrftoken = getCookie('csrftoken');
        

        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        // attaching ends here //

    var initialize_type = $("#initialize-type").val();

    function init(){
        console.log(initialize_type);

        if(initialize_type == "login"){
            // Login Events

            // This checks if a token is stored.
            //  If it is stored go directly to the index
            if(localStorage.getItem(key)){
                window.location.href = index_url
            }

            $("#form-login").on("submit", function(e){
                e.preventDefault();
                var data = $("#form-login").serialize();
                // This is a short hand for an ajax call!
                // login_api_url came from urls.js
                $.post(login_api_url, data)
                .done(function(res){
                    console.log(res.token);
                    // The key is stored on constants.js
                    // This could be stored on cookies too!
                    localStorage.setItem(key, res.token);

                    // There are pros and cons on storing it on cookies or localstorage
                    //  Read upon it!

                    // This should not be static!
                    window.location.href = index_url
                })
                .fail(function(res){
                    // This can be more elegant hontestly but for now. Just this. mehe.
                    $(".just-label-errors").text(res.responseText);
                    $(".just-label-errors").removeClass("d-none");
                    // Do note use response text in real development.
                    // Use the object "res.responseJSON" and check every field errors
                    //  then display it properrly
                    console.log(res);
                })
            });
        }else if(initialize_type == "index"){

            // Attach event
            $("#form-create-product").on("submit", function(e){
                // Prevents refresh of the page
                e.preventDefault();
                var data = $(this).serialize();
                $.ajax({
                    url: sample_product_api_url,
                    type: 'POST',
                    data: data,
                     // Fetch the stored token from localStorage and set in the header
                    headers:  { "Authorization": 'JWT ' + localStorage.getItem(key) }
                })
                .done(function(res){
                    // Append the newly created product
                     $(".table-body").append(
                        "<tr class='row-" + res.id +"'> <td>" + res.product_name + "</td>" +
                        "<td>" + res.product_brand + "</td>" +
                        '<td><button class="btn-archive btn-archive-'+res.id +'"> Archive </button></td> </tr>'
                    )
                    $(".btn-archive-"+res.id).data("id",  res.id);
                    console.log(res);
                    // Attach event so that that specific archive button
                    $(".btn-archive-"+res.id).on("click",function(){
                        // NOTE: This is a duplicate code and should be refactored on some way
                        
                        data = {
                            // Get the attached id on that specific button
                            id: $(this).data('id'),
                            is_active: false
                        }
                        // Short hand for an ajax call!
                        $.ajax({
                        // Url came from constanst.js
                          url: sample_product_api_url,
                          data: data,
                          type: 'PATCH',
                          // Fetch the stored token from localStorage and set in the header
                          headers:  { "Authorization": 'JWT ' + localStorage.getItem(key) }
                        })
                        .done(function(res){
                            // Removes the row from the front end
                            $(".row-"+res.id).remove();
                            console.log(res);
                        })
                        .fail(function(res){
                            console.log(res);
                        })
                    })
                })
                .fail(function(res){
                    // This can be more elegant hontestly but for now. Just this. mehe.
                    $(".just-label-errors").text(res.responseText);
                    $(".just-label-errors").removeClass("d-none");
                    // Do note use response text in real development.
                    // Use the object "res.responseJSON" and check every field errors
                    //  then display it properrly
                    console.log(res);
                })
            })

            // Request the backend to fetch the data
           $.ajax({
            // Url came from constanst.js
              url: sample_product_api_url,
              type: 'GET',
              // Fetch the stored token from localStorage and set in the header
              headers:  { "Authorization": 'JWT ' + localStorage.getItem(key) }
            })
           .done(function(res){
                // 
                var counter = 0;
                // Appends every response from the backend to frontend!
                while(counter < res.length){
                    // Assign every row with id, so we can remove it when the user
                    //  archives it
                    $(".table-body").append(
                        "<tr class='row-" + res[counter].id +"'> <td>" + res[counter].product_name + "</td>" +
                        "<td>" + res[counter].product_brand + "</td>" +
                        '<td><button class="btn-archive btn-archive-'+res[counter].id +'"> Archive </button></td> </tr>'
                    )
                    // Attach an attribute data-id to the button
                    $(".btn-archive-"+res[counter].id).data("id",  res[counter].id);
                    counter+=1;
                }
                AttachArchiveEvent();
                console.log(res);
           })
           .fail(function(res){
               console.log(res);
               // Flags token!
               localStorage.removeItem(key);
               window.location.href = login_url;
           })

           // Calling this would attach an event to every btn-archive
           function AttachArchiveEvent(){
                $(".btn-archive").on("click",function(){
                    data = {
                        // Get the attached id on that specific button
                        id: $(this).data('id'),
                        is_active: false
                    }
                    // Short hand for an ajax call!
                    $.ajax({
                    // Url came from constanst.js
                      url: sample_product_api_url,
                      data: data,
                      type: 'PATCH',
                      // Fetch the stored token from localStorage and set in the header
                      headers:  { "Authorization": 'JWT ' + localStorage.getItem(key) }
                    })
                    .done(function(res){
                        // Removes the row from the front end
                        $(".row-"+res.id).remove();
                        console.log(res);
                    })
                    .fail(function(res){
                        console.log(res);
                    })
                })
           }


        }

    }

    init();
})