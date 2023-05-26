const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();


app.use(cors()) 
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));




mongoose.connect('mongodb+srv://ashambickus:W3Iq4FxA5v2K@cluster0.7wepwzs.mongodb.net/ashambvirus', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const pagesSchema = new mongoose.Schema({
  html: String,
});

const Todo = mongoose.model('Pages', pagesSchema);


var CHEAT_MESSAGE = "None / Waiting to change";


// Serve the front-end page
app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/getCheat', (req, res) => {
  res.json({"message" :CHEAT_MESSAGE});
});
app.post('/changeCheat', (req, res) => {
  CHEAT_MESSAGE = (req.body.message === undefined ?  "None / Waiting to change" : req.body.message  )
  res.send(200)
});

app.get("/getWebpagesInfo", (req, res)=>{
  Todo.find()
    .then(strings => {  
      console.log("/getWebpagesInfo")
      res.json(strings);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve strings' });
    });
    
})

app.post('/sendWebpagesInfo', async (req, res) => {
  var html = req.body.html;
  try {
    const Page = new Todo({ html: html });
    await Page.save();
    console.log("Page saved.");
    res.status(201).send("Page saved successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save page.");
  }
});


app.delete('/deletePage/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the page by ID and remove it
    const deletedPage = await Todo.findByIdAndDelete(id);

    if (!deletedPage) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




// app.delete('/todos/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const todo = await Todo.findById(id);
//     if (!todo) {
//       res.status(404).json({ message: 'Page not found' });
//       return;
//     }

//     await todo.remove();
//     res.json({ message: 'Page deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.listen(80, () => {
  console.log('Server listening on port 80');
});
