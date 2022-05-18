/* variable setup */
let fragment = document.createDocumentFragment();
const imgSymbolMap = new Map()
buildimgSymbolMap()
//console.log(imgSymbolMap.get("acid"))
//console.log([...imgSymbolMap], imgSymbolMap.get("acid"))

/* button set up */
document.querySelector('button').addEventListener('click', getSpellInfo)

/* on window load */
window.onload = () => {
    getSpellList();
}

//TODO create all spell objects here since making requests anyway?
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

            if (data.name) {
                console.log(`Name: ${data.name}`)
                elementsToAdd.push(createElement("h2", data.name))
                //OOP TEST START
                let name = new SpellDetail("Name", data.name, null, null)
                console.log(`OOP TEST: ${JSON.stringify(name)}`)
            }
            if (data.damage) {
                console.log(`Damage Type: ${data.damage.damage_type.name} Image: ${imgSymbolMap.get(data.damage.damage_type.index)}`) //13 options (list above)
            }

            if (data.range) {
                console.log(`Range: ${data.range}`)
            }

            if (data.ritual) {
                console.log(`Ritual: ${data.ritual}`)
            }

            if (data.school) {
                console.log(`School: ${data.school.name}`)
            }

            if (data.casting_time) {
                console.log(`Casting Time: ${data.casting_time}`)
            }

            if (data.duration) {
                console.log(`Duration: ${data.duration}`)
            }

            if (data.attack_type) {
                console.log(`Attack Type: ${data.attack_type}`)
            }

            if (data.level) {
                console.log(`Level: ${data.level}`) //melee, ranged, or spell... many don't even have this
            }

            if (data.desc[0]) {
                console.log("Description:")
                data.desc.forEach(desc => {
                    console.log(desc)
                })
            }
            if (data.higher_level[0]) {
                console.log("Higher Level Description:")
                data.higher_level.forEach(desc => {
                    console.log(desc)
                })
            }

            fragment.append(createSectionWithChildren(elementsToAdd, "spellDescription"))
            spellSection.append(fragment); //append fragment to parent (allows all data to display in one load instead of many)
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


class Spell {
    constructor(name, spellDetails) {

    }
}

function buildimgSymbolMap() {
    //TODO change to sprite map? https://preview.redd.it/kf0xb3u9rgnz.jpg?width=960&crop=smart&auto=webp&s=742116833a1ff624ac90b04ff65c3e983b736c93
    //source: https://www.reddit.com/r/DnD/comments/71s8s8/art_schools_of_magic_symbols/
    //how to use sprite image: https://www.w3schools.com/css/css_image_sprites.asp

    /* switched to schools instead of damage type*/
    imgSymbolMap.set("Abjuration", "https://img.icons8.com/color/344/shield.png")
    imgSymbolMap.set("Conjuration", "https://img.icons8.com/external-two-tone-chattapat-/344/external-surprise-party-and-celebration-two-tone-chattapat-.png")
    imgSymbolMap.set("Divination", "https://img.icons8.com/cotton/344/crystal-ball.png")
    imgSymbolMap.set("Enchantment", "https://img.icons8.com/external-filled-outline-lima-studio/344/external-hypnotic-magic-filled-outline-lima-studio.png")
    imgSymbolMap.set("Evocation", "https://img.icons8.com/color/344/weightlifting-skin-type-4.png")
    imgSymbolMap.set("Illusion", "https://img.icons8.com/external-others-pike-picture/344/external-Illusionist-magic-others-pike-picture.png")
    imgSymbolMap.set("Necromancy", "https://img.icons8.com/external-wanicon-two-tone-wanicon/344/external-grim-reaper-halloween-costume-avatar-wanicon-two-tone-wanicon.png")
    imgSymbolMap.set("Transmutation", "https://img.icons8.com/office/344/chicken.png")
    /*
        Abjuration - Blocking, banishing, protecting 
        Conjuration - Produce creatures or objects from another plane
        Divination - Understanding the past, present and future
        Enchantment - Entrancing and beguiling
        Evocation - Raw combative power and damage
        Illusion - Sensory deception and trickery 
        Necromancy - Curses, creating undead thralls
        Transmutation - Changing energy and matter 
    */

}


/* END MY CODE */










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