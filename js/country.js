var base_url_areas = "http://api.football-data.org/v2/areas/";
var base_url_liga = "https://api.football-data.org/v2/competitions?areas="
// var base_url_team = "https://api.football-data.org/v2/competitions/"

function status(response) {
    if (response.status !== 200) {
        console.log("error : " + response.status)
        return Promise.reject(new Error(response.statusText))
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("error :  " + error);
}


function getCountrys() {

    if ('caches' in window) {
        caches.match(base_url_areas).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var countryHTML = "";
                    data.areas.forEach(function (country) {
                        countryHTML += `
                        <a href="./liga.html?id=${country.id}">
                        <div class="country-name black-text">${country.name}<i class="material-icons right">details</i></div>
                        </a>
                        `
                    })
                    document.getElementById("country").innerHTML = countryHTML;
                })
            }
        })
    }

    fetch(base_url_areas, {
            method: "GET",
            withCredentials: true,
            headers: {
                "X-Auth-Token": "75ef90f669f94902b8d8408d3cd4289c"
            }
        })
        .then(status)
        .then(json)
        .then(function (data) {
            var countryHTML = "";
            data.areas.forEach(function (country) {
                countryHTML += `
            <a href="./liga.html?id=${country.id}">
            <div class="country-name black-text">${country.name}<i class="material-icons right">details</i></div>
            </a>
            `
            })
            document.getElementById("country").innerHTML = countryHTML;
            remove();
        }).catch(error);
}

function getLigaByName() {
    return new Promise(function (resolve, reject) {


        var urlParamsLiga = new URLSearchParams(window.location.search);
        var ParentAreaIdParam = urlParamsLiga.get("id");

        if ('caches' in window) {
            caches.match(base_url_liga + ParentAreaIdParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        var country = `
                    <div class="center" id="negara"> ${data.competitions[0].area.name}</div>
                    <img class="responsive-img" id="bendera" alt="Flag"
                    src="${data.competitions[0].area.ensignUrl}">
                    `;
                        var countryHTML = ""
                        data.competitions.forEach(function (liga) {
                            countryHTML += `
                            <div class="card">
                                <div class="country-name black-text card-title">${liga.name}</div>
                                <div class="card-content">
                                
                                </div>
                            </div>
                            `
                        })
                        document.getElementById("body-render-liga").innerHTML = countryHTML;
                        // document.getElementById("body-render-country-liga").innerHTML = country;
                        resolve(data);
                    })
                }
            })
        }

        fetch(base_url_liga + ParentAreaIdParam, {
                method: "GET",
                withCredentials: true,
                headers: {
                    "X-Auth-Token": "75ef90f669f94902b8d8408d3cd4289c"
                }
            })
            .then(status)
            .then(json)
            .then(function (data) {
                var country = `
            <div class="center" id="negara"> ${data.competitions[0].area.name}</div>
            <img class="responsive-img" id="bendera" alt="Flag"
            src="${data.competitions[0].area.ensignUrl}">
            `;
                var countryHTML = ""
                data.competitions.forEach(function (liga) {
                    countryHTML += `
                    <div class="card">
                        <div class="country-name black-text card-title">${liga.name}</div>
                        <div class="card-content">
                        
                        </div>
                    </div>
                    `
                })
                document.getElementById("body-render-liga").innerHTML = countryHTML;
                // document.getElementById("body-render-country-liga").innerHTML = country;
                resolve(data);
                remove();
            }).catch(function (error) {
            });
    })
}



function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("countrys", "readonly");
                var store = tx.objectStore("countrys");
                return store.getAll();
            })
            .then(function (countrys) {
                resolve(countrys);
            })
    })
}

function getSavedCountrys() {
    getAll().then(function (countrys) {
        var countryHTML = "";
        countrys.forEach(function (country) {
            countryHTML += `
                <a href="./liga.html?id=${country.competitions[0].area.id}&saved=true">
                <div class="country-name black-text">${country.competitions[0].area.name}<i class="material-icons right">details</i></div>
                </a>
                `
        });

        document.getElementById("body-render").innerHTML = countryHTML;
        remove();

    })
}

function getSavedCountryById() {
    var urlParamsLiga = new URLSearchParams(window.location.search);
    var idParam = urlParamsLiga.get("id");

    getById(parseInt(idParam)).then(function (country) {
        var button = `
            <a class="waves-effect waves-light btn-large col s12 m6" href="./index.html#favorite"><i
            class="material-icons left">arrow_back</i>Back To Favorite</a>
        `;
        var countryHTML = ""
        country.competitions.forEach(function (countrys) {
            countryHTML +=
                `
                <div class="card">
                    <div class="country-name black-text card-title">${countrys.name}</div>
                    <div class="card-content">
                    
                    </div>
                </div>
            `
        })
        document.getElementById("body-render-country-liga").innerHTML = button;
        document.getElementById("body-render-liga").innerHTML = countryHTML;

    })
    remove();
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("countrys", "readonly");
                var store = tx.objectStore("countrys");
                return store.get(id);
            })
            .then(function (country) {
                resolve(country);
            })
            .catch(function (error) {
                console.log(error);
            })
    });
}



function remove() {
    var loader = document.getElementById("loader");
    loader.remove();
}
