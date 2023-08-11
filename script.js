let allPokemon = [];
let newLoadPokemon = 0;
let alltypes = [];
let loading = false;
let myChart;

function showLoadingAnimation() {
    document.getElementById("loading-animation").style.display = "block";
}

function hideLoadingAnimation() {
    document.getElementById("loading-animation").style.display = "none";
}

/**
 * Load Pokemon data from the PokeAPI and add to the allPokemon array.
 * 
 * This asynchronous function fetches Pokemon data from the PokeAPI
 * for a specified range of Pokemon IDs and adds them to the allPokemon array.
 */
async function loadPokemon() {
    showLoadingAnimation();
    // Loop through a range of Pokemon IDs and fetch their data
    for (let i = 1 + newLoadPokemon; i <= 20 + newLoadPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        let response = await fetch(url);
        let responseAsJson = await response.json();
        // Extract relevant data from the response
        let name = responseAsJson.name;
        let image = responseAsJson['sprites']['other']['home']['front_default'];
        let weight = responseAsJson['weight'];
        let height = responseAsJson['height'];
        // Build the types string
        let types = '';
        for (let k = 0; k < responseAsJson['types'].length; k++) {
         types += (responseAsJson['types'][k]['type']['name'] + ' ');
        };
        let stats = responseAsJson['stats']; // Get the Pokemon's base stats
        let pokemon = {name, image, types, stats, weight, height};   // Create a Pokemon object with the extracted data
        allPokemon.push(pokemon); // Add the Pokemon object to the allPokemon array
        alltypes.push(types); // Add the types to the alltypes array
    };
    hideLoadingAnimation();
    loadPokedex(); // Load the Pokedex after fetching and adding all Pokemon data
};

/**
 * Load and display the Pokedex with Pokemon cards.
 * 
 * This function loads and displays the Pokedex with Pokemon cards.
 */
function loadPokedex() {
    let container = document.getElementById('pokedex');
    container.innerHTML = '';
    let startIndex = 0; // Start index for loading new Pokémon
    // Loop through allPokemon data to display cards
    for (let j = startIndex; j < allPokemon.length; j++) {
        // Create HTML for the Pokemon car
        container.innerHTML += `
        <div onclick="popUp(${j})" class="pokemonCard hvr-grow" id="pokemonCard${j}">
            <span id="numberOfPokemon" class="numberOfPokemon">#${(j + 1).toString().padStart(3, '0')}</span>
            <h2>${allPokemon[j]['name'].toUpperCase()}</h2>
            <img src="${allPokemon[j]['image']}" alt="">           
            <div class="types">
                <span>${allPokemon[j]['types']}</span>
            </div>
        </div>
        `
        // Apply background color based on Pokemon type
        document.getElementById(`pokemonCard${j}`).style.backgroundColor = colorTypes[allPokemon[j]['types'].trim()];
    }
    loading = false; // Set loading to false after cards are loaded
};


//////////////////search-function/////////////////////

/**
 * Filter and display Pokemon cards based on search input.
 * 
 * This function filters the list of Pokemon cards based on the search input and displays the matching cards.
 */
function filterPokemon() {
    let search = document.getElementById('search-input').value;
    search = search.toLowerCase(); // Get the value of the search input field and convert it to lowercase
    let container = document.getElementById('pokedex'); // Get the container to display Pokemon cards
    container.innerHTML = '';
    // Loop through all Pokemon data to check for matches
    for (let j = 0; j < allPokemon.length; j++) {

        if (allPokemon[j]['name'].toLowerCase().includes(search)) {  // Check if the current Pokemon's name contains the search term
        // Add the filtered Pokemon card HTML to the container
        container.innerHTML += `
        <div onclick="popUp(${j})" class="pokemonCard hvr-grow" id="pokemonCard${j}">
            <span id="numberOfPokemon" class="numberOfPokemon"># ${j + 1}</span>
            <h2>${allPokemon[j]['name']}</h2>
            <img src="${allPokemon[j]['image']}" alt="">           
            <div class="types">
                <span>${allPokemon[j]['types']}</span>
            </div>
            </div>`
            // Apply background color based on Pokemon type
            document.getElementById(`pokemonCard${j}`).style.backgroundColor = colorTypes[allPokemon[j]['types'].trim()]; 
        };
    };
};

/**
 * Reload the current page.
 * 
 * This function reloads the current web page when a button is clicked.
 */
function reloadPage() {
    location.reload(); // Reload the current page
};

/**
 * Load more Pokemon cards.
 * 
 * This function increases the number of Pokemon cards to load by 20 and triggers the loading process.
 */
function loadMorePokemon() {
    if (!loading) { // Check if loading is not in progress
        loading = true; // Set loading to true to prevent concurrent loading
        newLoadPokemon += 20; // Increase the number of Pokemon cards to load
        loadPokemon(); // Trigger the loading process
    };
};

///////////////////////////////////// PopUP /////////////////////////////////////

/**
 * Display a popup with Pokemon card details.
 * 
 * This function generates and displays a popup containing details about a selected Pokemon card.
 * 
 * @param {number} card - The index of the selected Pokemon card in the allPokemon array.
 */
function popUp(card) {
    let secondTyp = '';  // empty variable defined to store the value of the 2nd type
    if (`${(alltypes[card]).split(' ')[1]}`) {
        secondTyp = (alltypes[card]).trim().split(' ')[1]  // A query to check if there is a 2nd type, if so then store in secondType
    } else {
        secondTyp = '-' // if not then a minus in the 2nd field
    }
    document.getElementById('background').classList.remove('display-no');
    document.getElementById('background').innerHTML = `
        <div class="popUpCard">
            <div id="backGwhiteTopSection" class="topSection d-flex flex-column align-items-center" style="width: 100%";>
                <div class="backGwhiteTopSection">
                    <div class="d-flex gap-2"><img class="closeAllarrow hvr-buzz-out" onclick="closePopUp()" src="img/iconmonstr-arrow-left-lined-24.png"><h6>Pokedex</h6></div>
                    <h6>#${(card + 1).toString().padStart(3, '0')}</h6>  
                </div>
                <img class="cardImg" src="${allPokemon[card]['image']}" alt="">
                <div class="popUpArrows">
                    <img onclick="slideLeft(${card - 1})" class="popUpArrowsLeft arrow hvr-grow2" src="img/arrowLeft1.png" alt="">
                    <img onclick="slideRight(${card + 1})" class="popUpArrowsRight arrow hvr-grow2" src="img/arrowRight.png" alt="">
                </div>
            <div class="backGwhitebottomSection d-flex flex-column align-items-center">
                <h4 class="text-center letterSpacing">${(allPokemon[card]['name']).toUpperCase()}</h4>
                <div class="popUpTyp">
                    <div class="abilityAndweight">
                        <span class="abilitys">${(alltypes[card]).trim().split(' ')[0]}</span>
                        <div class="d-flex flex-column align-items-center gap-4">
                            <span class="fs-5">${allPokemon[card]['weight']} KG</span>
                            <span class="letterSpacing fontsize">weight</span>
                        </div>
                    </div>
                    <div class="abilityAndweight">
                        <span class="abilitys">${secondTyp}</span>
                        <div class="d-flex flex-column align-items-center gap-4">
                            <span class="fs-5">${allPokemon[card]['height']} M</span>
                            <span class="letterSpacing fontsize">height</span>
                        </div>
                    </div>
                </div>
                <div>
                    <canvas class"myChart" id="myChart" style="position: relative; height:auto ;width:100%; max-width:420px"></canvas>
                </div>
            </div>
        </div>
    `
    // Customize the top section background color based on the Pokemon type
    document.getElementById('backGwhiteTopSection').style.backgroundColor = colorTypes[allPokemon[card]['types'].trim()]; 
    addChart(card)
};

/**
 * Add a bar chart to display base stats of a Pokemon.
 * 
 * This function creates or updates a bar chart using Chart.js to display the base stats of a given Pokemon card.
 * 
 * @param {number} card - The index of the selected Pokemon card in the allPokemon array.
 */
function addChart(card) {
    const ctx = document.getElementById('myChart'); // Get the chart context
    if (myChart) {
        myChart.clear(); // Clear the previous chart data
        myChart.destroy(); // Destroy the previous chart instance
    }
    // Create a new Chart instance
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['HP', 'ATTACK', 'DEFENSE', 'SP-ATT', 'SP-DEF', 'SPEED'],
        datasets: [{
          label: 'Base Stats',
          data: [allPokemon[card]['stats'][0]['base_stat'], allPokemon[card]['stats'][1]['base_stat'], 
                allPokemon[card]['stats'][2]['base_stat'], allPokemon[card]['stats'][3]['base_stat'], 
                allPokemon[card]['stats'][4]['base_stat'], allPokemon[card]['stats'][5]['base_stat']],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(201, 203, 207, 1)'
        ],
    }]
      },
      options: {
        responsive: true,
        scales: {
            y: {
              beginAtZero: true
            }
          }
        }
    });
};

/**
 * Close the Pokemon popup.
 * 
 * This function hides the popup background, clears its content, and loads the Pokedex.
 */
function closePopUp(){
    document.getElementById('background').classList.add('display-no'); //Hide the popup background
    document.getElementById('background').innerHTML = ''; // Clear the popup content
    loadPokedex(); // Load the Pokedex
};

/**
 * Slide the popup to the left to show the previous Pokemon.
 * 
 * @param {number} pokemonNum - The current Pokemon number.
 */
function slideLeft(pokemonNum) {
    closePopUp()
    if (pokemonNum >= 0) {
        popUp(pokemonNum--) // Show the previous Pokemon popup
    }  else {
        popUp(allPokemon.length - 1) // Show the last Pokemon popup
    } 
};

/**
 * Slide the popup to the right to show the next Pokemon.
 * 
 * @param {number} pokemonNum - The current Pokemon number.
 */
function slideRight(pokemonNum) {
    closePopUp()
    if (pokemonNum < allPokemon.length) {  
        popUp(pokemonNum++)
    }  else {
        popUp(0)
    }    
};


















