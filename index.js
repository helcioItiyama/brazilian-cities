const express = require('express');
const fs = require('fs');

const stateRouter = require('./router/states.js');

const app = express();

app.use(express.json());
app.use('/', stateRouter);


app.listen(3000, () => {
  try {
    fs.readFile('Estados.json', 'utf8', (err, data) => {
      if(err) throw err;
      let json = JSON.parse(data);
      json.forEach(({ID, Sigla}) => {
        state(ID, Sigla)
      });
    })
    
    
    function state(id, fileName) {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if(err) {
          const initialJson = {
            nextId: id,
            state: []
          }

          fs.writeFile(`${fileName}.json`, JSON.stringify(initialJson), err => {
            if(err) console.log(err);
          })
        } 
      });
    }

    fs.readFile('Cidades.json', 'utf8', (err, cityData) => {
      if(err) throw err;
      
      let cities = JSON.parse(cityData);
      
      fs.readFile('Estados.json','utf8', (err, data) => {
        let json = JSON.parse(data);

        json.map(({ID, Sigla}) => {
          const eachCity = cities.filter(city => city.Estado === ID)
        
          fs.readFile(`${Sigla}.json`, 'utf8', (err, stateData) => {
            if(err) throw err;
  
            let json = JSON.parse(stateData);

            if(json.state.length < eachCity.length) {
              json.state = eachCity
            }
  
            fs.writeFile(`${Sigla}.json`, JSON.stringify(json), err =>{
              if(err) throw err;
            });
          });
        })  
      })
      if(err) throw err;
    })

  } catch(err) {
    console.log('error')
  }
})