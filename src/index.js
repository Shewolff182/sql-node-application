const express = require('express'); //external module for using express
const {Client} = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());
const client = new Client(config); //creating our database Client with our config values

//crud routes
const getLanguages = async () => {
    await client.connect() //connecting to our database
    const result = await client.query('SELECT * FROM programming_languages');
    console.log(result.rows);
    await client.end() //ending the connection to our database
    return result.rows;
}
    app.get('/get-languages', async (req, res) => {
    const languages = await getLanguages();
    res.send(languages);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//helper function
const getLanguage = async (id) => {
    await client.connect() //connecting to our database
    const result = await client.query(`SELECT * FROM programming_languages WHERE id = ${id}`)
    console.log(result.rows);
    await client.end() //ending the connection to our database
    return result.rows; //returning array-sent back to front end
}

//callback
app.get('/get-language/:id', async (req, res) => {
    const language = await getLanguage(req.params.id);
    res.send(language);
});

//post
const createLanguage = async (language, releasedYear, githutRank, pyplRank, tiobeRank ) => {
    await client.connect() //connecting to our database
    const result = await client.query(`INSERT INTO programming_languages (name, released_year, githut_rank, pypl_rank, tiobe_rank) VALUES ('${language}', ${releasedYear}, ${githutRank}, ${pyplRank}, ${tiobeRank})`)
    console.log(result.rows);
    await client.end() //ending the connection to our database
    return result.rows;
}
app.post('/create-language', async(req, res) => {
    const language = await createLanguage(req.body.language, req.body.releasedYear, req.body.githutRank, req.body.pyplRank, req.body.tiobeRank);
    res.send(language);
});

//delete
const deleteLanguage = async (id) => {
    await client.connect() //connecting to our database
    const result = await client.query(`DELETE FROM programming_languages WHERE id = ${id}`)
    console.log(result.rows);
    await client.end() //ending the connection to our database
    return result.rows;
}
app.delete('/delete-language/:id', async (req, res) => {
    const language = await deleteLanguage(req.params.id);
    res.send("successfully deleted entry")
});