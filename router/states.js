const express = require('express');
const router = express.Router();
const fs = require('fs');

let stateArray = [];
let stateSorted = [];
let longestCityNames = [];
let shortestCityNames = [];

router.get('/states/:uf', (req, res) => {
  const uf =  req.params.uf.toUpperCase();
  fs.readFile(`${uf}.json`, (err, data) => {
    try {
      if(err) throw err;
      let json = JSON.parse(data);

      //Find Longest City Names
      let sortedNames = json.state.map(element => {
        return { value: Number(element.Nome.length), city: element.Nome, state: uf }
      });

      sortedNames.sort((a, b) => (a.value === b.value) 
        ? a.city.localeCompare(b.city) 
        : (b.value - a.value));
      
      const [ longestCityName ] = sortedNames.slice(0, 1);
      
      if(!longestCityNames.some(city => city.city === longestCityName.city)) {
        longestCityNames.push(longestCityName)
       }

      // Find Shortest City Names
      const [ shortestCityName ] = sortedNames.slice(sortedNames.length - 1)
      
      if(!shortestCityNames.some(city => city.city === shortestCityName.city)) {
        shortestCityNames.push(shortestCityName)
      }
      
      if(!stateArray.includes(`${uf} - ${json.state.length}`)) {
        stateArray.push(`${uf} - ${json.state.length}`);
      }

      //Send { UF - (Number of Cities) }
      res.send({ [uf]: json.state.length });

    } catch(err) {
      res.status(400).send({ error: err.message });
    }
  })
})

router.get('/longestcitynamesparstate', (_, res) => {
  try {
    const results = longestCityNames.map(city => `${city.city} - ${city.state}`);
    res.send(results);

  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

router.get('/shortestcitynamesparstate', (_, res) => {
  try {
    const results = shortestCityNames.map(city => `${city.city} - ${city.state}`);
    res.send(results);

  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})

router.get('/mostcities', (_, res) => {
  try {
    let mapped = stateArray.map((element, index) => {
      const [_, cityLength] = element.split('-');
      return { index, value: Number(cityLength)};
    })
    
    mapped.sort((a, b) => (a.value < b.value) || (a.value === b.value) -1);
    stateSorted = mapped.map(element => stateArray[element.index])
  
    const mostSorted = stateSorted.slice(0, 5);
    res.send(mostSorted);
    
  } catch(error) {
    res.status(400).send({ error: err.message });
  }
})


router.get('/lesscities', (_, res) => {
  try {
    lessSorted = stateSorted.slice(stateSorted.length - 5);
    res.send(lessSorted);

  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})


router.get('/longestcityname', (_, res) => {
  try{
    longestCityNames.sort((a, b) => (a.value === b.value) 
      ? a.city.localeCompare(b.city) 
      : (b.value - a.value));

    let selectedLongest = longestCityNames.slice(0, 1);
    res.send(selectedLongest);

  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})


router.get('/shortestcityname', (_, res) => {
  try {
    shortestCityNames.sort((a, b) => (a.value === b.value) 
    ? a.city.localeCompare(b.city) 
    : (a.value - b.value));

    let selectedShortest = shortestCityNames.slice(0, 1);
    res.send(selectedShortest);

  } catch(err) {
    res.status(400).send({ error: err.message });
  }
})


module.exports = router;