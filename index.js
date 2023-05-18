const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the wacc.html file when accessing the root route
app.get('/', (req, res) => {
  res.sendFile('wacc.html', { root: __dirname });
});

// Handle form submission and calculate WACC
app.post('/wacc', (req, res) => {
  const { costOfEquity, costOfDebt, taxRate, equityWeight, debtWeight } = req.body;
  const wacc = (((costOfEquity/100) * equityWeight) + ((1 - (taxRate/100)) * (costOfDebt/100) * debtWeight))/10000;

  // Send the WACC result to a new page
  res.send(`The WACC is ${wacc}%`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
