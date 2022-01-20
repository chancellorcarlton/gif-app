require('dotenv').config()
const {CONNECTION_STRING} = process.env
const axios = require('axios');
const apiKey = require('./config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    getGif: (req, res) => {
        axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey.gif_api_key}&tag=funny&rating=g`)
        .then(gifRes => {
            res.status(200).send(gifRes.data.data.images.original.url);
        });
    },

    user: (req, res) => {
        const {username, password, firstName, lastName, email} = req.body;

        sequelize.query(`INSERT INTO users (username, password, first_name, last_name, email)
        VALUES(${username}, ${password}, ${firstName}, ${lastName}, ${email})
        RETURNING *;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err));
    }

};