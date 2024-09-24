var curr_page_num = 1;
var page_limit = 30;
let total_pages = 0; // Initialize total_pages variable

const BASE_URL = "https://starwars-databank-server.vercel.app/api/v1/locations";
const current_Api_url = `${BASE_URL}?page=${curr_page_num}&limit=${page_limit}`;

// Function to fetch data from API and calculate total pages
async function fetchDataAndCalculateTotalPages(api_url) 
{
    try 
    {
        // Check if total_pages has already been set
        if (total_pages === 0) 
        {
            const response = await fetch(api_url);
            if (!response.ok) 
            {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            total_pages = Math.ceil(data["info"]["total"] / page_limit);
            console.log('Total pages:', total_pages);
        }
    } 
    catch (error) 
    {
        console.error('Error fetching data:', error);
    }
}

// Example usage
fetchDataAndCalculateTotalPages(current_Api_url);

document.addEventListener('DOMContentLoaded', function() {
    const prev = document.getElementById("prev");
    const current = document.getElementById("current");
    const next = document.getElementById("next");

    next.addEventListener('click',() =>{

        if(!next.classList.contains('disabled'))
        {
            window.scrollTo(0, 0);
            curr_page_num += 1;
            next_api_url = `${BASE_URL}?page=${curr_page_num}&limit=${page_limit}`;
            displayContent(next_api_url,"all");
            current.innerHTML = curr_page_num;
    
            if(curr_page_num == total_pages)
                next.classList.add('disabled');
            else
                prev.classList.remove('disabled');
        }
    });

    prev.addEventListener('click',() =>{

        if(!prev.classList.contains('disabled'))
        {
            window.scrollTo(0, 0);
            curr_page_num -= 1;
            prev_api_url = `${BASE_URL}?page=${curr_page_num}&limit=${page_limit}`;
            displayContent(prev_api_url,"all");
            current.innerHTML = curr_page_num;
    
            if(curr_page_num == 1)
                prev.classList.add('disabled');
            else 
                next.classList.remove('disabled');
        }
    })
    

});

// Function to create HTML for a character card
function createCardHTML(uid, entry) 
{
    var img_url = entry["image"];
    var name = entry["name"];
    var description = entry["description"]
    const cardRowDiv = document.createElement("div");
    cardRowDiv.classList.add("row", "g-0", "m-4", "border", "border-black", "rowClass", "text-start"); //apply bootstrap css property col to the cardImgDiv

    const cardHTML = `
        <div class="col-md-4">
            <img src="${img_url}" class=" card-img-top img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-bodytext-start p-3">
                <h5 class="card-title pb-2 ">${name}</h5>
                <p class="card-text">${description}</p>
            </div>
        </div>
    `
    // set innerHTML of cardRowDiv with cardHTML
    cardRowDiv.innerHTML = cardHTML
    return cardRowDiv;
}

displayContent(current_Api_url, "all");

async function displayContent(current_Api_url, api_type) 
{
    const response = await fetch(current_Api_url, { method: 'GET' }); // fetch the json object from the api
    const jsonList = await response.json(); //prase the response into json format
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = ""; // clear the current content

    let cardRowDiv;
    if (api_type == "all") 
    {
        var dataList = jsonList["data"];
        var pageLimit = jsonList["info"]["limit"];

        for (let uid = 0; uid < pageLimit; uid++) 
        {
            cardRowDiv = createCardHTML(uid, dataList[uid]);
            // append cardDiv to cardRow
            cardContainer.appendChild(cardRowDiv);
        }
    }
    else if (api_type == "single_character") 
    {
        console.log(jsonList);
        cardRowDiv = createCardHTML(0, jsonList[0]);
        // append cardDiv to cardRow
        cardContainer.innerHTML = "";
        cardContainer.appendChild(cardRowDiv);
    }
}

function capitalizeFirstLetter(string) 
{
    let words = string.split(' ');
    let capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords;
}
// Ensure that the JavaScript code runs after the DOM content is fully loaded
window.addEventListener("DOMContentLoaded", (event) => {
    const searchButton = document.getElementById("searchButton");
    const searchBox = document.getElementById("searchBox");

    searchButton.addEventListener('click', (event) => 
    {
        event.preventDefault(); // Prevent the default form submission behavior IMPORTANT CATCH!!
        let value = searchBox.value;
        let capitalizedWords = capitalizeFirstLetter(value);
        let nameStr = capitalizedWords.join("%20");
        character_current_Api_url = `${BASE_URL}/name/${nameStr}`;
        displayContent(character_current_Api_url,"single_character");

    });
});


document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('searchBox');
    if (input) {
        input.addEventListener("input", function() {
            var dataList = document.getElementById('json-datalist');
            dataList.innerHTML = ''; // Clear previous options
            // Create a new XMLHttpRequest.
            var request = new XMLHttpRequest();
            // Handle state changes for the request.
            request.onreadystatechange = function(response) {
                if (request.readyState === 4) 
                {
                    if (request.status === 200) 
                    {
                        // Parse the JSON
                        var jsonOptions = JSON.parse(request.responseText);
                        // Get input value
                        var inputValue = input.value.toLowerCase();
                        // Filter options that start with the input value
                        var filteredOptions = jsonOptions.filter(function(item) {
                            return item.toLowerCase().startsWith(inputValue);
                        });
                        // Loop over the filtered options array.
                        filteredOptions.forEach(function(item) {
                            // Create a new <option> element.
                            var option = document.createElement('option');
                            // Set the value using the item in the JSON array.
                            option.value = item;
                            // Add the <option> element to the <datalist>.
                            dataList.appendChild(option);
                        });
                    } 
                    else 
                    {
                        // An error occurred :(
                        console.error("Couldn't load datalist options :(");
                    }
                }
            };
            // Set up and make the request.
            request.open('GET', 'final_names.json', true);
            request.send();
        });
    } 
    else 
    {
        console.error("Input element not found!");
    }
});








