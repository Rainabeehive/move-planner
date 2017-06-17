function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    //Adding concatenated streetStr and cityStr
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();

    //Creating a full address
    var address = streetStr + ',' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');

    //View streetview 
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location= ' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    //-------------------------NYtimes AJAX request-------------------------
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=1c76256339984d839500767245a3d449'
    $.getJSON(nytimesUrl, function (data) {
        $nytHeaderElem.text('New york Times Articles About ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' +
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +

                '</li>');
        };
        //Chaining, throw error if messing up the url
    }).error(function (e) {
        $nytHeaderElem.text('New York Times Article Could Not Be Loaded')
    });
    
    
    //-------------------------Wiki AJAX-------------------------
    //1)Fire off JSON-P request with $.ajax()
    //      a) Include dataType and success parameter
    //2)Iterate through response
    //3)Present articles on the page inside <ul id="wikipedia-links"></ul>
    var wikiUrl = 'https://en.wikipedasdfasdfia.org/w/api.php?action=opensearch&search='+ cityStr +' &format=json&callback=wikiCallback'; 
    
    //error handing does not built in jsonp
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    //after 8 second, changed the content to above text
    $.ajax({
        url: wikiUrl,
        dataType:"jsonp",
        //json:"callback",
        success: function(response){
            var articleList = response[1];
            for(var i = 0; i < articleList.length; i++){
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href = "' + url + '">' + articleStr + '</a></li>');
                
            };
            
            clearTimeout(wikiRequestTimeout);
            
        }

    });

    





    return false;
};

$('#form-container').submit(loadData);
