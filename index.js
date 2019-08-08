'use strict';

const apiKey = 'MClIS2mCXchmhs5WG18IhZ089GkaG2zZ3rXVDdPH'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // if no results - tell the user to try again, otherwise display results
  if (responseJson.data.length === 0) {
    $('#results-list').append(
    `<li>
    <p>We could not find results for this. Please try again.</p>
    </li>`)
  }
  else {
    for (let i = 0; i < responseJson.data.length; i++){
      $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}" target="blank">${responseJson.data[i].url}</a></p>
      </li>`)
    }
  }
  //display the results section  
  $('#results').removeClass('hidden');
}

function getParkData(query, limit=5) {
  const params = {
    stateCode: query,
    api_key: apiKey,
    limit,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-search-term').val();
    const limit = $('#js-max-results').val();
    getParkData(state, limit);
  });
}

$(watchForm);