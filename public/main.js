const addCard = document.querySelector('.addCardButton');
const removeCard = document.querySelector('.removeCardButton');
const updateCard = document.querySelector('.changeCardButton');
const pictureConfirm = document.querySelector('.picture_confirm');
const picture_monitor = document.querySelector('.picture_monitor');
const closeDeckSlider = document.querySelectorAll('.close-window');
const openDeckSlider = document.querySelector('.open-window');
const cardName = document.querySelector('input[name="cardName"]');
const cardPicture = document.querySelector('input[name="cardPicture"]');
const trashcan = document.querySelectorAll('.fa-trash-can');
const minusIcon = document.querySelectorAll('.fa-minus-square');
const plusIcon = document.querySelectorAll('.fa-plus-square');
const checkUpdateIcon = document.querySelectorAll('.fa-check');
const searchCardByName = document.querySelector('.fa-magnifying-glass')
const createDeck = document.querySelector('.createDeck');

pictureConfirm.addEventListener('click', () => {
    picture_monitor.innerHTML = `<img src='${cardPicture.value}'>`
})


addCard.addEventListener('click', insertCard)
removeCard.addEventListener('click', deleteCard)
/* Fetch Functions */
async function insertCard(e) {
    e.preventDefault()
    let deckURL = new URL(window.location.href);
    let deckNameParam = deckURL.searchParams.get('name');
    if (cardName.value == "" || cardPicture.value == "") {
        console.log("Card and Link should have VALUE")
        return;
    }
    await fetch('/deck_builder', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: cardName.value,
            img: cardPicture.value,
            quantity:1,
            deckName:deckNameParam
        })
    }).then(res => {
        if (res.ok) return res.json()
    }).then(data =>window.location.reload(true))
        .catch(error => console.error(error))
}
/*Fetch Delete card */
async function deleteCard(e) {
    e.preventDefault()
    let deckURL = new URL(window.location.href);
    let deckNameParam = deckURL.searchParams.get('name');
    await fetch('/deck_builder', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cardName: cardName.value,
            deckName:deckNameParam
        })
    }).then(res => {
        window.location.reload(true)
    })
}


/* Deck slider window controls*/
closeDeckSlider.forEach(closeBTN=>{
    closeBTN.addEventListener('click', (e) => {
        console.log(e.target.parentNode)
        e.target.parentNode.style.display = "none"
       // document.querySelector('.slide-container').style.display = "none"
    })
})
// addEventListener('click', (e) => {
    // console.log(e.target.parentNode)
   // document.querySelector('.slide-container').style.display = "none"
// })
openDeckSlider.addEventListener('click', () => {
    document.querySelector('.slide-container').style.display = "block"
})

/*Icon event listeners */
/***********************************************************************/
/*TrashCan Icon */
trashcan.forEach(icon => {
    icon.addEventListener('click', (e) => {
        cardName.value = e.target.parentNode.parentNode.querySelector('p').textContent;
        document.querySelector('.deleteMsg').textContent = `Do you want to delete ${cardName.value}? press Remove`;
        document.querySelector('.deleteMsg').style.opacity = '1';
    })
})
/*Minus Icon */
minusIcon.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let cardQuantity = e.target.parentNode.parentNode.querySelector("span").textContent.split('')[1];
        let cardCounterInput = e.target.parentNode.querySelector('.cardCounter');
        console.log(cardQuantity - (-cardCounterInput.value))
        cardQuantity - (-cardCounterInput.value) > 0 ? cardCounterInput.value--:null
    });
})
/*Plus Icon */
plusIcon.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let cardQuantity = e.target.parentNode.parentNode.querySelector("span").textContent.split('')[1];
        
        let cardCounterInput = e.target.parentNode.querySelector('.cardCounter');
        (+cardCounterInput.value)+(+cardQuantity) < 4  ? +cardCounterInput.value++ : null;
    });
})
/* Check icon to update card quantity */
checkUpdateIcon.forEach(icon => {
    icon.addEventListener('click', async (e) => {
        let deckURL = new URL(window.location.href);
        let deckNameParam = deckURL.searchParams.get('name');
        let cardName = e.target.parentNode.parentNode.querySelector('.cardName').textContent;
        let quantityToAdd = e.target.parentNode.querySelector('.cardCounter').value;
        console.log(quantityToAdd)
        console.log(cardName)
        await fetch('/deck_builder', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cardName: cardName,
                quantityToAdd: quantityToAdd,
                deckName:deckNameParam
            })
        }).then(res => {
            if (res.ok) return res.json()
        }).then(data => window.location.reload(true))
            .catch(error => console.error(error))
    })
})

/*Card selection container function*/
function cardsSelection(data) {
    const imgDiv = document.createElement('div');
    const sliderIMG = document.createElement('img');
    imgDiv.classList.add("swiper-slide");
    sliderIMG.classList.add("swiper-lazy")
    sliderIMG.src = `${data.imageUrl}`;
    sliderIMG.name = `${data.name}`
    imgDiv.appendChild(sliderIMG);
    document.querySelector('.swiperSearchedSlide > .swiper-wrapper').appendChild(imgDiv);
}
/*Search card by name from MTG API */
searchCardByName.addEventListener('click', async () => {
    const cardNameInput = document.querySelector('#searchCardByName');
    let cardData = [];
    await fetch(`https://api.magicthegathering.io/v1/cards?name=${cardNameInput.value}`)
        .then(res => res.json())
        .then(data => {
            cardData = data.cards.slice(0, 4).filter((obj) => obj.imageUrl)
        }).catch(error => console.log(error))
     console.log(cardData)
    /*Function that creates card selection container needs to be added here*/
    cardData.forEach(data => {   
        cardsSelection(data)
    })
    document.querySelectorAll(".searchResults img").forEach(image=>{
        image.addEventListener('click',(e)=>{
            console.log(e.target)
            cardName.value = e.target.name;
            cardPicture.value = e.target.src;
        })
    })
})

createDeck.addEventListener('click', newDeck);
function newDeck(){
    document.querySelector('.newDeck').style.display = 'block';
}
document.querySelector(".addDeckBTN").addEventListener('click',addNewDeck)
async function addNewDeck(){
    const newDeckName = document.querySelector('.newDeckName').value;
    document.querySelector('.newDeck').style.display = 'none';
    const newDeckRequest = await fetch('/create_deck', {
        method:'post',
        headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                newDeckName:newDeckName})
    })
    const data = await newDeckRequest.json()
    console.log(data)   
}

//Deck navigation links 

function deckSwitching(){
    let deckNavsArray = []
    const deckNavs = document.querySelectorAll('.deck').forEach(elem=>deckNavsArray.push(elem));
    deckNavsArray.shift()
    deckNavsArray.pop()
    deckNavsArray.forEach(cardBTN => cardBTN.addEventListener('click', function(e){
        window.location.href = `/deckCollection?name=${e.currentTarget.querySelector('p').textContent}`
    }))
    document.querySelector('.decksCollection > div:first-child>span').style.boxShadow = "inset 3px 3px 8px rgb(111, 0, 255),inset -3px -3px 8px rgb(111, 0, 255)"
}
deckSwitching()
// document.querySelector('.test').addEventListener('click', async(e)=>{
//     e.preventDefault()
//     await fetch('/deck_builder', {
//         method: 'put',
//         headers: {'Content-Type':'application/json'},
//         body:JSON.stringify({
//             cardName: "Ancestor's Chosen"
//         })
//     }).then(res => {
//         if (res.ok) return res.json()
//     }).then(data => console.log(data))
//         .catch(error => console.error(error))
// })
