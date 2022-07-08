const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 5000;
const DB_STRING = process.env.DB_STRING
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static(__dirname + '/public'))

MongoClient.connect(`mongodb+srv://Arx_Lancifer:jRjYldvotSLLxMxh@cluster0.w4sq0l0.mongodb.net/?retryWrites=true&w=majority`)
.then(client =>{
    console.log('Connected to MTG Database')
    const deckDB = client.db('mtg-deck-builder');
    const deckCollection = deckDB.collection('mydeck')

    app.get(`/`, async (req, res)=>{ //app.get(`name=${deckname}`, async (req, res)
        //Used this 3 lines to set quantity values ive forgot for all documents
        // await deckCollection.find().forEach(item=>{
        //    deckCollection.update({},{$set:{quantity:1}})
        // })
        //console.log(await deckCollection.find({name: "Ancestor's Chosen"}).toArray())
        // var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        const deckname = req.query.name || 'mydeck';
        try {
        const deck =  await deckDB.collection(`${deckname}`).find().toArray(); //deckDB.collection(`${deckname}`)
        const allDecks = await deckDB.listCollections({},{nameOnly:true}).toArray();
        // console.log(allDecks)
        res.render('index.ejs', {cards:deck, allDecks:allDecks})
        } catch (error) {
            console.log(error)
        }  
    })
    app.get('/deckCollection', async function(req,res){
        try {
            const deckname = req.query.name;
            const deck =  await deckDB.collection(`${deckname}`).find().toArray();
            const allDecks = await deckDB.listCollections({},{nameOnly:true}).toArray();
            //Perform speed with Promise.all 
            //const data = await Promise.all([deckDB.collection(`${deckname}`).find().toArray(), await deckDB.listCollections({},{nameOnly:true}).toArray()])
            allDecks.sort(obj=>obj.name === deckname ? -1:1)
            res.render('index.ejs', {cards:deck, allDecks:allDecks})
        } catch (error) {
            res.status(404)
            res.send('Deck cant be found')
        }
       
    })
    app.post('/deck_builder', (req, res)=>{
       try{
        deckDB.collection(`${req.body.deckName}`).insertOne({
            name:req.body.name,
            img:req.body.img,
            quantity:1
        }) //-> need to change this dynamicly for deck card insertion
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

    app.post('/create_deck', async(req, res)=>{
        try {
            // if(!deckDB.listCollections({name:'A new collection'}))
            const newDeckName = req.body.newDeckName;
                await deckDB.createCollection(newDeckName);
                res.json("newDeck created")
        } catch (error) {
            res.json('Deck already exists')
        } 
    })
    
    app.listen(PORT, ()=>{
        console.log(`Server is running on PORT: ${PORT}`)
    })
})

