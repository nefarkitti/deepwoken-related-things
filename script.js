//neff

let cardsContainer = document.getElementById("cardsContainer")
let sizeSlider = document.getElementById("cardsize")
let sizeIndic = document.getElementById("cardsizeIndicator")
let searchBar = document.getElementById("searchbar")
let filter = document.getElementById("filter")
let tagList = document.getElementById("tagList")
let modal = document.getElementById("modal")

var r = document.querySelector(':root');

sizeIndic.innerText = "card size: 0.5"
modal.style.display = "none"

sizeSlider.addEventListener("input", function(){
    sizeIndic.innerHTML = `card size: ${sizeSlider.value/10}`
    r.style.setProperty('--card-size', sizeSlider.value/10);
})

let searchParams = ""
let filterParams = "all"

let maxCardsToShow = 50
let cardsTotal = 0
let actualCards = 0
let tags = []
let usedTags = []

let loadedOaths = []
let loadedOathIcons = []
let loadedClasses = []
let specialData
let classData

let allAttr = ["Power", "Haircuts", "Grips", "Weapon", "Heavy Wep.", "Medium Wep.", "Light Wep.", "Strength", "Fortitude", "Agility", "Intelligence", "Willpower", "Charisma", "Flamecharm", "Frostdraw", "Thundercall", "Galebreathe", "Shadowcast", "Ironsing"]

//tagList.innerHTML = `<span class="addnew" onclick="addNewTag()"><i class="fa-solid fa-plus"></i>add new</span>`
tagList.innerHTML = ``

function closePopup() {
    modal.style.display = `none`
}

function updateTag(n, i) {

    let slider = document.getElementById(`tagSlider#${n}`)
    let amount = document.getElementById(`tagAmount#${n}`)

    amount.innerText = slider.value

    tags[i].amount = slider.value

    //loadall()

}

function updateTagFilter(n, i) {

    let selector = document.getElementById(`tagSelect#${n}`)
    tags[i].type = selector.value

}

function updateTags() {

    console.log(tags)

    tags.forEach(tag=>{
        let now = tag.id

        tagList.innerHTML += `
        <span class="tag" id="tag#${now}">
                    <span class="altContainer">${tag.type}</span>
                    <div class="slidecontainer">
                        <input step="5" type="range" min="0" max="100" value="${tag.amount}" class="slider" onchange="updateTag(${now}, ${tags.indexOf(tag)})" id="tagSlider#${now}"><span id="tagAmount#${now}">${tag.amount}</span>
                    </div>
                </span>`
    })

    
    //tagList.innerHTML += `<span class="addnew" onclick="addNewTag()"><i class="fa-solid fa-plus"></i>add new</span>`

}

function addNewTag(typ) {

    tagList.innerHTML = ``

    let now = Date.now()

    tags.push(
        {
            "id": now,
            "type": typ,
            "amount": 0
        }
    )

    updateTags()

}

/*allAttr.forEach(attribute=>{
    addNewTag(attribute)
})*/

function removeTag(index, id) {
    tags.shift(Number(index), 1)
    document.getElementById(id).remove()
}

filter.addEventListener("input", function(){
    filterParams = filter.value
    maxCardsToShow = 50
    cardsTotal = 0
    actualCards = 0
    loadall()
})

searchBar.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        /*if (rateLimit == true) {
            return
        }
        rateLimit = true*/
        searchParams = searchBar.value
        maxCardsToShow = 50
        cardsTotal = 0
        actualCards = 0
        loadall()
    }
});

function updateMaxCards(by) {
    maxCardsToShow += by
    cardsTotal = 0
    actualCards = 0
    loadall()
}

function showPopup(cardData) {
    console.log("hello there")

    closePopup()

    if (cardData == 0) return;

    let windowIndex = window.location.search
    const urlParams = new URLSearchParams(windowIndex);
    urlParams.append("q", "hi")

    let cdata = JSON.parse(cardData)

    modal.style.display = ``

    let cardDisplay = document.getElementById("cardSlot")
    let cardInfo = document.getElementById("cardInfo")
    let cardTitle = document.getElementById("cardTitle")

    cardDisplay.innerHTML = ``
    cardInfo.innerHTML = ``
    cardTitle.innerHTML = ``

    console.log(cdata)

    cardTitle.innerHTML = cdata.name

    let card2load = 0

    if (cdata.cardtype) {

        console.log(cdata.cardtype)

        if (cdata.cardtype != "oath") {
            //bell
            console.log("bell card")
        } else {
            //oath
            console.log("oath card")
            let oath = cdata
            card2load = generateCard(`Oath: ${oath.name}`, oath.cardtype, oath.icon, oath.name, oath.desc, oath.effects, true, undefined, undefined, undefined, true)
        }

    } else { // normal talents

        let talent = cdata

        let cardType = "normal"
        let cardIcon = "unknown"

        let talentReqs = talent.reqs

        if (specialData.rares.includes(talent.name)) {
            cardType = "rare"
        }
        if (specialData.advanced.includes(talent.name)) {
            cardType = "advanced"
        }

        talentReqs.forEach(requirement=>{
            if (requirement.includes("Flamecharm")) {
                cardIcon = "fire"
            } else if (requirement.includes("Thundercall")) {
                cardIcon = "bolt"
            } else if (requirement.includes("Shadowcast")) {
                cardIcon = "spark"
            } else if (requirement.includes("Galebreathe")) {
                cardIcon = "wind"
            } else if (requirement.includes("Thundercall")) {
                cardIcon = "bolt"
            } else if (requirement.includes("Ironsing")) {
                cardIcon = "cube"
            } else if (requirement.includes("Frostdraw")) {
                cardIcon = "frost"
            }

            else if (requirement.includes("Strength")) {
                cardIcon = "fist"
            } else if (requirement.includes("Fortitude")) {
                cardIcon = "shield"
            } else if (requirement.includes("Charisma")) {
                cardIcon = "handshake"
            } else if (requirement.includes("Intelligence")) {
                cardIcon = "potion"
            } else if (requirement.includes("Willpower")) {
                cardIcon = "saviour"
            } else if (requirement.includes("Agility")) {
                cardIcon = "mountains"
            }

            else if (requirement.includes("Heavy Wep.") || requirement.includes("Medium Wep.") || requirement.includes("Light Wep.")) {
                cardIcon = "sword"
            }
            
        })

        if (loadedClasses.includes(talent.class)) {
            if (classData[loadedClasses.indexOf(talent.class)].icon != "") {
                console.log("changing icon")
                cardIcon = classData[loadedClasses.indexOf(talent.class)].icon
                console.log(cardIcon)
            }
        }

        if (loadedOaths.includes(talent.class)) {
            cardIcon = loadedOathIcons[loadedOaths.indexOf(talent.class)]
        }

        card2load = generateCard(`${talent.name}`, cardType, cardIcon, `${talent.class}`, talent.desc, talent.effects, true, true, undefined, undefined, true)
        console.log("normal talent")
    }

    console.log("generated")
    console.log(card2load)

    if (card2load == 0) {
        modal.style.display = "none"
        return
    }

    card2load.style.display = ``

    /*cardInfo.innerHTML += `
    <div class="infoTabs">
    <span onclick="changeInfoTab('general')">GENERAL</span>
    <span>TALENTS</span>
    <span>MANTRAS</span>
    </div>
    `*/

    cardInfo.innerHTML += `
    <h2>${cdata.name}</h2>
    `


    cardInfo.innerHTML += cdata.desc

    if (cdata.reqs && cdata.reqs[0] != "") {
        cardInfo.innerHTML += `<h3>Requirements</h3>`

        let cardReqs = document.createElement("div")
        cardReqs.classList.add("cardRequirements")
    
        cardInfo.appendChild(cardReqs)
    
        if (cdata.cardtype == "oath") {
            allAttr.forEach(attri=>{
                if (cdata.reqs[attri]) {
                    cardReqs.innerHTML += `<span>${attri}: ${cdata.reqs[attri]}</span>`
                }
            })
            if (cdata.reqs.talents) {
                cdata.reqs.talents.forEach(talent=>{
                    cardReqs.innerHTML += `<span>${talent}</span>`
                })
            }
            if (cdata.reqs.Attunement) {
                cardReqs.innerHTML += `<span>Attunement: ${cdata.reqs.Attunement}</span>`
            }
            if (cdata.reqs.bell) {
                cardReqs.innerHTML += "<span>Obtain your Resonance</span>"
            }
            if (cdata.reqs.rep) {
                cdata.reqs.rep.forEach(faction=>{
                    cardReqs.innerHTML += `<span>Positive rep with ${faction}</span>`
                })
            }
            if (cdata.reqs.medallions) {
                cardReqs.innerHTML += `<span>Medallions: ${cdata.reqs.medallions}</span>`
            }
            if (cdata.reqs.items) {
                cdata.reqs.items.forEach(item=>{
                    cardReqs.innerHTML += `<span>Item(s): ${item}</span>`
                })
            }
            if (cdata.reqs.quests) {
                cdata.reqs.quests.forEach(quest=>{
                    cardReqs.innerHTML += `<span>Complete Quest: ${quest}</span>`
                })
            }
            if (cdata.reqs.eitherOr) {
                let i = 0
                allAttr.forEach(attri=>{
                    if (cdata.reqs.eitherOr[attri]) {
                        i++
                        let or = ""
                        if (i != Object.keys(cdata.reqs.eitherOr).length) {
                            or = "or "
                        }
                        cardReqs.innerHTML += `${attri}: ${cdata.reqs.eitherOr[attri]} ${or}`
                    }
                })
            }
        } else {
            cdata.reqs.forEach(requirement=> {
                cardReqs.innerHTML += `<span>${requirement}</span>`
            })
            if (cdata.needs != "None") {
                cdata.needs.forEach(need=>{
                    cardReqs.innerHTML += `<span onclick='showPopup(${JSON.stringify(cardData)})'>${need}</span>`
                })
            }
        }
    }

    cardInfo.innerHTML += `
    <div class="cardInfoicon">
    <img src="/talent-icons/${cdata.icon}.png">
    </div>
    `

    cardDisplay.appendChild(card2load)

}

function generateCard(name, cardtype, icon, cla, desc, fx, extra, override, othertags, data = 0, searchOff) {

    let cardDiv = document.createElement("div")
    cardDiv.classList.add("card")
    cardDiv.style.display = `none`

    if (searchOff != true) {
        if (name.toUpperCase().indexOf(searchParams.toUpperCase()) > -1 || cla.toUpperCase().indexOf(searchParams.toUpperCase()) > -1) {
        } else {
            cardDiv.classList.remove("card")
            console.log("did not meet search filter criteria")
            return 0
        }
    }

    console.log(filterParams)
    console.log(cardtype)

    if (searchOff != true) {
        if (filterParams != "all") {
            if (filterParams == cardtype) {
                console.log("correct card type")
            } else {
                console.log("did not meet type filter criteria")
                return 0;
            }
        }
    }

    if (searchOff != true) {
        cardsTotal ++
    }

    if (cardsTotal == maxCardsToShow+1) {
        cardsContainer.innerHTML += `
        <div class="card" id="seemorecard" onclick="updateMaxCards(50)" style="display:none;">
            <img class="base" src="cards/mantra_card.png" alt="">
            <div class="overlay">
                <img class="vignette" src="cards/card_vignette.png" alt="">
            </div>
            <div class="icon">
                <img class="cardicon" src="talent-icons/eye.png" alt="">
            </div>
            <div class="name">
                <div>See More</div>
            </div>
            <div class="class">
                <div>Search</div>
            </div>
            <div class="description">
                <div>You vow to open your eyes to all the information in the world.</div>
            </div>
        </div>
        `
    }

    document.getElementById("titleSection").innerHTML = `Gallery (${actualCards}/${cardsTotal} loaded)`

    if (searchOff != true) {
        if (cardsTotal > maxCardsToShow) return 0;
    }

    if (searchOff != true) {
        actualCards ++
    }

    document.getElementById("titleSection").innerHTML = `Gallery (${actualCards}/${cardsTotal} loaded)`

    /*let fontSize = name.length

    if (name.length <= 10) {
        fontSize = 10
    }
    if (name.length <= 6) {
        fontSize = 12
    }
    if (name.length >= 11) {
        fontSize = 12
    }
    if (name.length >= 15) {
        fontSize = 9
    }
    if (name.length >= 18) {
        fontSize = 8
    }*/

    //if (name.length >= 15) return;

    cardDiv.innerHTML = `
    <img class="base" src="cards/${cardtype}_card.png" alt="">
            <div class="overlay">
                <img class="vignette" src="cards/card_vignette.png" alt="">
            </div>
            <div class="icon">
                <img class="cardicon" src="talent-icons/${icon}.png" alt="">
            </div>
            <div class="name">
                <div>${name}</div>
            </div>
            <div class="class">
                <div>${cla}</div>
            </div>
            <div class="description">
                <div>${desc}</div>
            </div>
    `

    if (extra == true) {
        console.log("extra is true")
        if (override == true) {

            if (fx != "None") {

                console.log("haii")

                let bonus = document.createElement("div")
                bonus.classList.add("bonus")
            
                let bonusContainer = document.createElement("div")
                bonusContainer.classList.add("bonusContainer")
    
                fx.forEach(effect => {
        
                    let bonusDiv = document.createElement("div")
                    bonusDiv.innerHTML = `${effect}`
        
                    bonusContainer.appendChild(bonusDiv)
        
                })

                bonus.appendChild(bonusContainer)
                cardDiv.appendChild(bonus)
            }
    
        } else {
            console.log("override is false")
            let bonus = document.createElement("div")
            bonus.classList.add("bonus")
        
            let bonusContainer = document.createElement("div")
            bonusContainer.classList.add("bonusContainer")
    
            let store = []
            let STATKEYS = Object.keys(fx)
            let STATVALUES = Object.values(fx)
            for (let i = 0; i < STATVALUES.length; i++) {
                let key = STATKEYS[i]
                let val = STATVALUES[i]
                store.push({
                    "name": key,
                    "value": val
                })
            }
    
            store.forEach(effect => {
    
                let bonusDiv = document.createElement("div")
                bonusDiv.innerHTML = `+${effect.value} ${effect.name}`
    
                bonusContainer.appendChild(bonusDiv)
    
            })
    
            bonus.appendChild(bonusContainer)
            cardDiv.appendChild(bonus)
        }
    }

    let bah = data

    if (data != 0) {
        bah = JSON.stringify(data)
    }

    cardDiv.setAttribute("onclick", `showPopup('${bah}')`)

    return cardDiv

}

function loadall() {

    document.getElementById("titleSection").innerHTML = `Gallery (0/0 loaded)`

    cardsContainer.innerHTML = `
    <div id="spinner" class="loading">
    <img src="assets/loading-better-darker.png">
    </div>
    `

    axios.get("jsons/classes.json").then(res => {

        classData = res.data

        loadedClasses = []

        classData.forEach(c => {
            loadedClasses.push(c.name)
        }) 

        axios.get('jsons/oaths.json').then(res => {
            let jsonData = res.data // should be json by default
        
            loadedOaths = []
            loadedOathIcons = []
        
            jsonData.forEach(oath => {
                let card = generateCard(`Oath: ${oath.name}`, oath.cardtype, oath.icon, oath.name, oath.desc, oath.effects, undefined, undefined, undefined, oath)
                if (card != 0) {
                    cardsContainer.appendChild(card)
                    loadedOaths.push(oath.name)
                    loadedOathIcons.push(oath.icon)
                }
            });
        
            axios.get('jsons/special.json').then(res => {
                specialData = res.data // should be json by default
            
                axios.get('jsons/talents.json').then(res => {
                    let jsonData = res.data // should be json by default
                
                    jsonData.forEach(talent => {
            
                        let cardType = "normal"
                        let cardIcon = "unknown"
    
                        let talentReqs = talent.reqs
            
                        if (specialData.rares.includes(talent.name)) {
                            cardType = "rare"
                        }
                        if (specialData.advanced.includes(talent.name)) {
                            cardType = "advanced"
                        }
    
                        talentReqs.forEach(requirement=>{
                            if (requirement.includes("Flamecharm")) {
                                cardIcon = "fire"
                            } else if (requirement.includes("Thundercall")) {
                                cardIcon = "bolt"
                            } else if (requirement.includes("Shadowcast")) {
                                cardIcon = "spark"
                            } else if (requirement.includes("Galebreathe")) {
                                cardIcon = "wind"
                            } else if (requirement.includes("Thundercall")) {
                                cardIcon = "bolt"
                            } else if (requirement.includes("Ironsing")) {
                                cardIcon = "cube"
                            } else if (requirement.includes("Frostdraw")) {
                                cardIcon = "frost"
                            }
    
                            else if (requirement.includes("Strength")) {
                                cardIcon = "fist"
                            } else if (requirement.includes("Fortitude")) {
                                cardIcon = "shield"
                            } else if (requirement.includes("Charisma")) {
                                cardIcon = "handshake"
                            } else if (requirement.includes("Intelligence")) {
                                cardIcon = "potion"
                            } else if (requirement.includes("Willpower")) {
                                cardIcon = "saviour"
                            } else if (requirement.includes("Agility")) {
                                cardIcon = "mountains"
                            }
    
                            else if (requirement.includes("Heavy Wep.") || requirement.includes("Medium Wep.") || requirement.includes("Light Wep.")) {
                                cardIcon = "sword"
                            }
                            
                        })

                        if (loadedClasses.includes(talent.class)) {
                            if (classData[loadedClasses.indexOf(talent.class)].icon != "") {
                                console.log("changing icon")
                                cardIcon = classData[loadedClasses.indexOf(talent.class)].icon
                                console.log(cardIcon)
                            }
                        }
        
                        if (loadedOaths.includes(talent.class)) {
                            cardIcon = loadedOathIcons[loadedOaths.indexOf(talent.class)]
                        }

                        console.log(cardIcon)

                        talent.icon = cardIcon
            
                        let card = generateCard(`${talent.name}`, cardType, cardIcon, `${talent.class}`, talent.desc, talent.effects, false, undefined, undefined, talent)
                        if (card != 0) {
                            cardsContainer.appendChild(card)
                        }
                    });

                    axios.get('jsons/bells.json').then(res => {
                        let jsonData = res.data // should be json by default
                    
                        jsonData.forEach(bell => {
                            let card = generateCard(`${bell.name}`, bell.cardtype, bell.icon, `${bell.class}`, bell.desc,undefined, undefined, undefined, undefined, bell)
                            if (card != 0) {
                                cardsContainer.appendChild(card)
                            }
                        });

                        document.getElementById("spinner").remove()

                        document.querySelectorAll(".card").forEach(card => {
                            card.style.display = ``
                        })
                    
                    }).catch(console.error)
                
                }).catch(console.error)
            
            }).catch(console.error)
        
        }).catch(console.error)

    }).catch(console.error)
}

loadall()