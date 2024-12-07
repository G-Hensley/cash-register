let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
let cash = document.getElementById("cash");
let total = document.getElementById("total");

let pennies = document.getElementById("pennies");
let nickels = document.getElementById("nickels");
let dimes = document.getElementById("dimes");
let quarters = document.getElementById("quarters");
let ones = document.getElementById("ones");
let fives = document.getElementById("fives");
let tens = document.getElementById("tens");
let twenties = document.getElementById("twenties");
let hundreds = document.getElementById("hundreds");

let changeArray = [pennies, nickels, dimes, quarters, ones, fives, tens, twenties, hundreds];

for (let i = 0; i < changeArray.length; i++) {
    changeArray[i].innerText += " " + cid[i][1];
}

// Define currency units in cents for accurate calculations
const currencyUnits = {
    "PENNY": 1,
    "NICKEL": 5,
    "DIME": 10,
    "QUARTER": 25,
    "ONE": 100,
    "FIVE": 500,
    "TEN": 1000,
    "TWENTY": 2000,
    "ONE HUNDRED": 10000
  };
  
  // Function to calculate the total cash in the drawer
  function getTotalCid(cid) {
    return cid.reduce((sum, curr) => sum + Math.round(curr[1] * 100), 0);
  }
  
  // Calculate change and update the DOM
  document.getElementById("purchase-btn").addEventListener("click", function (e) {
    e.preventDefault();
  
    // Convert the provided cash to cents
    let cashInput = parseFloat(document.getElementById("cash").value);
    if (isNaN(cashInput)) {
      alert("Please enter a valid amount of cash.");
      return;
    }
    let cashInCents = Math.round(cashInput * 100);
    let priceInCents = Math.round(price * 100);
    let changeDueInCents = cashInCents - priceInCents;
    let totalCidInCents = getTotalCid(cid);
  
    // If cash provided is less than the price
    if (cashInCents < priceInCents) {
      alert("Customer does not have enough money to purchase the item");
      return;
    }
  
    // If cash provided is equal to the price
    if (cashInCents === priceInCents) {
      document.getElementById("change-due").innerText = "No change due - customer paid with exact cash";
      return;
    }
  
    // If the total cash in the drawer is less than change due
    if (totalCidInCents < changeDueInCents) {
      document.getElementById("change-due").innerText = "Status: INSUFFICIENT_FUNDS";
      return;
    }
  
    // Calculate change to give back
    let changeArray = [];
    let cidCopy = JSON.parse(JSON.stringify(cid)).reverse();
  
    for (let i = 0; i < cidCopy.length; i++) {
      let unitName = cidCopy[i][0];
      let unitTotal = Math.round(cidCopy[i][1] * 100);
      let unitValue = currencyUnits[unitName];
      let unitAmount = 0;
  
      while (changeDueInCents >= unitValue && unitTotal >= unitValue) {
        changeDueInCents -= unitValue;
        unitTotal -= unitValue;
        unitAmount += unitValue;
      }
  
      if (unitAmount > 0) {
        changeArray.push([unitName, unitAmount / 100]);
      }
    }
  
    // If changeDueInCents is not 0, exact change cannot be provided
    if (changeDueInCents > 0) {
      document.getElementById("change-due").innerText = "Status: INSUFFICIENT_FUNDS";
      return;
    }
  
    // If total cash in the drawer equals the initial change due, set status to CLOSED
    if (totalCidInCents === cashInCents - priceInCents) {
      document.getElementById("change-due").innerText = `Status: CLOSED ${changeArray.map(unit => `${unit[0]}: $${unit[1]}`).join(' ')}`;
      return;
    }
  
    // Otherwise, set status to OPEN and display change due
    document.getElementById("change-due").innerText = `Status: OPEN ${changeArray.map(unit => `${unit[0]}: $${unit[1]}`).join(' ')}`;
  });
  