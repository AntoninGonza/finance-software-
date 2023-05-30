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

// Handle form submission and calculate NPV
app.post('/NPV', (req, res) => {
  const { costOfProject, RevenueYear1, RevenueYear2, RevenueYear3, RevenueYear4, discountRate } = req.body;
  const r = discountRate / 100; // Convert discount rate to a decimal
  const NPV = -costOfProject + (RevenueYear1 / (1 + r)) + (RevenueYear2 / Math.pow(1 + r, 2)) + (RevenueYear3 / Math.pow(1 + r, 3)) + (RevenueYear4 / Math.pow(1 + r, 4));

  // Send the NPV result to a new page
  res.send(`The NPV is ${NPV} $`);
});

// Handle form submission and calculate IRR
app.post('/IRR', (req, res) => {
  const { cashFlows } = req.body;
  const cashFlowArray = cashFlows.split(',').map(Number);

  // Calculate IRR using the Newton-Raphson method
  const calculateIRR = (cashFlowArray) => {
    const epsilon = 0.00001; // The desired level of precision
    let irr = 0.1; // Initial guess for IRR
    let npv = 0;

    const npvFunction = (irr, cashFlowArray) => {
      let result = 0;

      for (let i = 0; i < cashFlowArray.length; i++) {
        result += cashFlowArray[i] / Math.pow(1 + irr, i);
      }

      return result;
    };

    const derivativeFunction = (irr, cashFlowArray) => {
      let result = 0;

      for (let i = 1; i < cashFlowArray.length; i++) {
        result -= i * cashFlowArray[i] / Math.pow(1 + irr, i + 1);
      }

      return result;
    };

    let delta;
    do {
      delta = npvFunction(irr, cashFlowArray) / derivativeFunction(irr, cashFlowArray);
      irr -= delta;
    } while (Math.abs(delta) > epsilon);

    return irr * 100; // Convert IRR to a percentage
  };

  const irrResult = calculateIRR(cashFlowArray);

  // Send the IRR result to a new page
  res.send(`The IRR is ${irrResult.toFixed(2)}%`);
});




app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
