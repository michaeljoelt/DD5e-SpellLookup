/* variable setup */
let testMode = true;
let spellList = []
let fragment = document.createDocumentFragment();
const spellSection = document.querySelector("#spell")
const spellSectionList = document.querySelector("ul")
const p = document.createElement('p')
const li = document.createElement('li')
const img = document.createElement('img')
const damageMap = new Map()
buildDamageMap()
//console.log(damageMap.get("acid"))
//console.log([...damageMap], damageMap.get("acid"))

/* button set up */
document.querySelector('button').addEventListener('click', getSpellInfo)

/* on window load */
window.onload = () => {
    getSpellList();
}

function getSpellList() {
    fetch("https://www.dnd5eapi.co/api/spells")
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            //printTest("On window load, get spell list", JSON.stringify(data, null, 4))

            data.results.forEach(spell => {
                // console.log(spell.name)
                spellList.push((spell.name).replace("'", "&#39;"))
            });
            //console.log(spellList)
            /* initiate autocomplete */
            autocomplete(document.getElementById("myInput"), spellList);
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}


//handle button click
function getSpellInfo() {

    clearDom()

    //event.preventDefault // breaks dropdown

    //replace spaces with - to match api's syntax
    const choice = ((document.querySelector('input').value).replace(/\s/g, '-').replace('/', '-').replace("'", "")).toLowerCase()
    const url = `https://www.dnd5eapi.co/api/spells/${choice}`

    console.log(url)

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log("On input submission, get spell info:")
            console.log(data)

            /* section: #spellTitle */
            let elementsToAdd = []
            if (data.name) {
                console.log(`Name: ${data.name}`)
                elementsToAdd.push(createElement("h2", data.name))
            }
            if (data.damage) {
                console.log(`Damage Type: ${data.damage.damage_type.name} Image: ${damageMap.get(data.damage.damage_type.index)}`) //13 options (list above)
                // fragment.appendChild(createElementWithImage("li", `Damage Type: ${data.damage.damage_type.name}`, damageMap.get(data.damage.damage_type.index)))
                elementsToAdd.push((createSectionWithChildren([
                    createImg(damageMap.get(data.damage.damage_type.index), data.damage.damage_type.name, data.damage.damage_type.name),
                    createElement("p", `${data.damage.damage_type.name} Damage`)
                ])))
            }

            fragment.append(createSectionWithChildren(elementsToAdd, "spellTitle"))

            /* section: #spellReference 
            - find what's available and add them all together at end */
            elementsToAdd = []
            // elementsToAdd.push(createElement("h3", "Quick Reference"))
            if (data.range) {
                console.log(`Range: ${data.range}`)
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `Range:`), createElement("p", data.range)]))
            }

            if (data.ritual) {
                console.log(`Ritual: ${data.ritual}`)
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `Ritual:`), createElement("p", data.ritual)]))
            }

            if (data.school) {
                console.log(`School: ${data.school.name}`)
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `School:`), createElement("p", data.school.name)]))
            }

            if (data.casting_time) {
                console.log(`Casting Time: ${data.casting_time}`)
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `Casting Time:`), createElement("p", data.casting_time)]))
            }

            if (data.duration) {
                console.log(`Duration: ${data.duration}`)
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `Duration:`), createElement("p", data.duration)]))
            }

            if (data.attack_type) {
                console.log(`Attack Type: ${data.attack_type}`) //melee, ranged, or spell... many don't even have this
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `Attack Type:`), createElement("p", data.attack_type)]))
            }

            if (data.level) {
                console.log(`Level: ${data.level}`) //melee, ranged, or spell... many don't even have this
                elementsToAdd.push(createSectionWithChildren([createElement("h3", `Level:`), createElement("p", data.level)]))
            }

            fragment.append(createSectionWithChildren(elementsToAdd, "spellReference"))

            // if (data.damage) {
            //     console.log(`Damage Type: ${data.damage.damage_type.name} Image: ${damageMap.get(data.damage.damage_type.index)}`) //13 options (list above)
            //     // fragment.appendChild(createElementWithImage("li", `Damage Type: ${data.damage.damage_type.name}`, damageMap.get(data.damage.damage_type.index)))
            //     fragment.appendChild(createSectionWithChildren([createElement("h3", `Damage Type`), createImg(damageMap.get(data.damage.damage_type.index)), createElement("p", data.damage.damage_type.name)]))
            // }

            /* section: #spellDescription */
            elementsToAdd = []
            if (data.desc[0]) {
                console.log("Description:")
                elementsToAdd.push(createElement("h3", "Description"))
                data.desc.forEach(desc => {
                    console.log(desc)
                    elementsToAdd.push(createElement("p", desc))
                })
            }
            if (data.higher_level[0]) {
                console.log("Higher Level Description:")
                elementsToAdd.push(createElement("h3", "Higher Level"))
                data.higher_level.forEach(desc => {
                    console.log(desc)
                    elementsToAdd.push(createElement("p", desc))
                })
            }
            fragment.append(createSectionWithChildren(elementsToAdd, "spellDescription"))

            //append fragment to parent (allows all data to display in one load instead of many)
            spellSection.append(fragment);

        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function clearDom() {
    fragment = document.createDocumentFragment();
    while (spellSection.firstChild) {
        spellSection.removeChild(spellSection.firstChild);
    }
    spellSection.append(fragment);
}

function createElement(element, value, id) {
    const newItem = document.createElement(element);
    newItem.innerText = value;
    if (id) {
        newItem.id = id
    }
    return newItem;
}

function createImg(src, alt, tooltip) {
    const newImg = document.createElement("img");
    newImg.src = src
    newImg.alt = alt
    newImg.title = tooltip
    return newImg
}

// function createElementWithImage(element, value, imgUrl) {
//     const newItem = document.createElement(element);
//     newItem.innerHTML = `<img src="${imgUrl}"> ${value}`;
//     return newItem;
// }

function createSectionWithChildren(arrayOfChildren, id) {
    const newSection = document.createElement("section");
    if (id) {
        newSection.id = id
    }
    arrayOfChildren.forEach((element) => {
        newSection.appendChild(element)
    })
    return newSection
}

function printTest(label, variable) {
    if (testMode) {
        console.log(`${label}: ${variable}`)
    }
}

function buildDamageMap() {

    damageMap.set("acid", "https://img.icons8.com/color/344/acid-on-surface.png") //flask: https://img.icons8.com/color/344/acid-flask.png
    damageMap.set("bludgeoning", "https://img.icons8.com/external-icongeek26-flat-icongeek26/344/external-hammer-museum-icongeek26-flat-icongeek26.png")
    damageMap.set("cold", "https://img.icons8.com/external-tulpahn-flat-tulpahn/344/external-snowy-weather-tulpahn-flat-tulpahn.png")
    //"https://img.icons8.com/external-microdots-premium-microdot-graphic/344/external-freeze-christmas-new-year-vol1-microdots-premium-microdot-graphic.")
    damageMap.set("fire", "https://img.icons8.com/external-flat-juicy-fish/344/external-fossil-vehicle-mechanics-flat-flat-juicy-fish.png")
    damageMap.set("force", "https://img.icons8.com/external-tulpahn-outline-color-tulpahn/344/external-spell-book-fairy-tale-tulpahn-outline-color-tulpahn.png")
    damageMap.set("lightning", "https://img.icons8.com/external-wanicon-flat-wanicon/344/external-lightning-nature-wanicon-flat-wanicon.png")
    damageMap.set("necrotic", "https://img.icons8.com/external-flat-juicy-fish/344/external-death-crisis-management-flat-flat-juicy-fish.png")
    damageMap.set("piercing", "https://img.icons8.com/external-icongeek26-flat-icongeek26/344/external-spear-alaska-icongeek26-flat-icongeek26.png")
    damageMap.set("poison", "https://img.icons8.com/color/344/poison-bottle.png")
    damageMap.set("psychic", "https://img.icons8.com/external-flatart-icons-outline-flatarticons/344/external-mind-office-essentials-and-operational-exellence-flatart-icons-outline-flatarticons.png")
    damageMap.set("radiant", "https://img.icons8.com/external-flaticons-flat-flat-icons/344/external-holy-ghost-religion-flaticons-flat-flat-icons.png")
    damageMap.set("slashing", "https://img.icons8.com/external-victoruler-flat-victoruler/344/external-swords-chess-victoruler-flat-victoruler.png")
    damageMap.set("thunder", "https://img.icons8.com/external-tal-revivo-bold-tal-revivo/344/external-wireless-power-logotype-with-lightning-bolt-sign-battery-bold-tal-revivo.png")

}










/* 

AUTCOMPLETE MAGIC - credit: https://www.w3schools.com/howto/howto_js_autocomplete.asp

*/
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    getSpellInfo()
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
            getSpellInfo()
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}