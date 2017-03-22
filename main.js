var ACCESS_TOKEN = "dXEXPs0JQL0t1mn1Zkt69ueYYZetysOLZnC9ODmcrgq6-oXl4zBHqjY4XAP-MtLUjsdQwyQ6a4Fws48-qY40S1Y536U672WFXcpwgA31kY7T6Nnw1bARWOmx9vW9WHYx"

/*
The "https://cors-anywhere.herokuapp.com/" allows to circumvent Cross-Origin security policies. It's ok to do this in a lab, but in a real application you shouldn't send request to 3rd parties from the client-side, as it makes your access token public
*/
var YELP_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3"
var SEARCH_ENDPOINT = YELP_ENDPOINT + "/businesses/search"

var KEY_ENTER = 13

$(document).ready(function() {
  var coords = undefined
  $("#search-button").attr('disabled', true)
  $("#error-message").append('Waiting for GPS coordinates...')

  if(navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      coords = position.coords
      $("#search-button").attr('disabled', false)
      $("#error-message").empty()
    })
  }

  $("#search-term").keydown(function(event){
    if(event.keyCode === KEY_ENTER)
    requestSearch($("#search-term").val(), coords)
  })

  $("#search-button").click(function() {
    requestSearch($("#search-term").val(), coords)
  })
})

function requestSearch(searchTerm, coordinates) {
  var settings = {
    data: {
      term: searchTerm,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    },
    headers: {
      Authorization: "Bearer " + ACCESS_TOKEN
    },
    success: searchSuccess,
    error: function(jqXHR, error, errorThrown) {
      searchError(jqXHR, error, errorThrown)
    }
  }

  jQuery.ajax(SEARCH_ENDPOINT, settings)
}

/**
 * Add the businesses to the page
 * @param {*} data
 * @param {*} textStatus
 * @param {*} jqXHR
 */
function searchSuccess(data, textStatus, jqXHR) {
  console.table(data.businesses)
  $("#search-results").empty()
  data.businesses.forEach(addSearchResult)
}

function searchError(jqXHR, error, errorThrown) {
  console.log(jqXHR)
}

function addSearchResult(business) {
  var businessDiv = $("<div />", {'class': 'business'})
  var businessHeaderDiv = $("<div />", {'class': 'businessHeader'})
  var name = $("<span class=\"name\">"+ business.name +"</span>")

  var priceRatingRow = $("<div />", {
    'class': 'row'
  })
  priceRatingRow.append($("<span />", {
    html: business.price
  }))

  var rating = $("<span />", {
    title: business.review_count + ' reviews'
  })

  // adding the full stars
  for (var i = 0; i < Math.floor(business.rating); i++) {
    rating.append($('<i class="fa fa-star" aria-hidden="true"></i>'))
  }

  if (business.rating - Math.floor(business.rating) > 0) {
    rating.append($('<i class="fa fa-star-half-o" aria-hidden="true"></i>'))
  }

  priceRatingRow.append(rating)

  var image = $("<img />", {
    src: business.image_url
  })

  businessDiv.append(image)
  businessHeaderDiv.append(name)
  businessHeaderDiv.append(priceRatingRow)
  businessDiv.append(businessHeaderDiv)
  businessDiv.appendTo($("#search-results"))
}