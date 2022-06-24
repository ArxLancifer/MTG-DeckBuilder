const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 5000;
const DB_STRING = process.env.DB_STRING
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static(__dirname + '/public'))

MongoClient.connect(DB_STRING)
.then(client =>{
    console.log('Connected to MTG Database')
    const deckDB = client.db('mtg-deck-builder');
    const deckCollection = deckDB.collection('mydeck')

    app.get('/', async (req, res)=>{
        //Used this 3 lines to set quantity values ive forgot for all documents
        // await deckCollection.find().forEach(item=>{
        //    deckCollection.update({},{$set:{quantity:1}})
        // })
        //console.log(await deckCollection.find({name: "Ancestor's Chosen"}).toArray())
        try {
        const deck =  await deckCollection.find().toArray();
        res.render('index.ejs', {cards:deck})
        } catch (error) {
            console.log(error)
        }
       
    })
    
    app.post('/deck_builder', (req, res)=>{
       try{
        deckCollection.insertOne(req.body)
        .then(result=>res.json("Card added succefully"))
       }catch(error){
        console.error(error)
       }
        
    })
    
    app.delete('/deck_builder',async (req, res)=>{
        deckCollection.deleteOne(
            {name:req.body.cardName},
            ).then(result=>{
            res.json('Card Deleted')
        }).catch(error=> console.error(error))


    })

    app.put('/deck_builder', (req, res)=>{

        deckCollection.updateOne(
            {name:req.body.cardName,
            },
            {$inc:{quantity:+req.body.quantityToAdd}}
        ).then(result=>{
            res.json('One more card added')
        })
        
    })

    
    app.listen(PORT, ()=>{
        console.log(`Server is running on PORT: ${PORT}`)
    })
})

