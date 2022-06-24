const addCard = document.querySelector('.addCardButton');
const removeCard = document.querySelector('.removeCardButton');
const updateCard = document.querySelector('.changeCardButton');
const pictureConfirm = document.querySelector('.picture_confirm');
const picture_monitor = document.querySelector('.picture_monitor');
const closeDeckSlider = document.querySelector('.close-window');
const openDeckSlider = document.querySelector('.open-window');
const cardName = document.querySelector('input[name="cardName"]');
const cardPicture = document.querySelector('input[name="cardPicture"]');
const trashcan = document.querySelectorAll('.fa-trash-can');
const minusIcon = document.querySelectorAll('.fa-minus-square');
const plusIcon = document.querySelectorAll('.fa-plus-square');
const checkUpdateIcon = document.querySelectorAll('.fa-check');
const searchCardByName = document.querySelector('.fa-magnifying-glass')

pictureConfirm.addEventListener('click', () => {
    // console.log("Input changed to: " + cardPicture.value)
    picture_monitor.innerHTML = `<img src='${cardPicture.value}'>`
})


addCard.addEventListener('click', insertCard)
removeCard.addEventListener('click', deleteCard)
/* Fetch Functions */
async function insertCard(e) {
    e.preventDefault()
    
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
            quantity:1
        })
    }).then(res => {
        if (res.ok) return res.json()
    }).then(data =>window.location.reload(true))
        .catch(error => console.error(error))
}
/*Fetch Delete card */
async function deleteCard(e) {
    e.preventDefault()
    await fetch('/deck_builder', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cardName: "Ancestor's Chosen"
        })
    }).then(res => {
        console.log(res.status)
        res.json()
    })
    //.then(data=>console.log(data))
}


/* Deck slider window controls*/
closeDeckSlider.addEventListener('click', () => {
    document.querySelector('.slide-container').style.display = "none"
})
openDeckSlider.addEventListener('click', () => {
    document.querySelector('.slide-container').style.display = "block"
})

/*Icon event listeners */
/***********************************************************************/
/*TrashCan Icon */
trashcan.forEach(icon => {
    icon.addEventListener('click', (e) => {
        console.log(e.target.parentNode.parentNode)
        e.target.parentNode.parentNode.style.display = 'none'
    })
})
/*Minus Icon */
minusIcon.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let cardQuantity = e.target.parentNode.parentNode.querySelector("span").textContent.split('')[1];
        let cardCounterInput = e.target.parentNode.querySelector('.cardCounter');

        // +cardCounterInput.value >-cardQuantity? +cardCounterInput.value-- : null; 
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
        let cardName = e.target.parentNode.parentNode.querySelector('.cardName').textContent;
        let quantityToAdd = e.target.parentNode.querySelector('.cardCounter').value;
        console.log(quantityToAdd)
        console.log(cardName)
        await fetch('/deck_builder', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cardName: cardName,
                quantityToAdd: quantityToAdd
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
