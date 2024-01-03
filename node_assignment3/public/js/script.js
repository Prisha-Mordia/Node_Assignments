// public/js/script.js
// Sample code to save and retrieve data in localStorage
const dummyData = { key: 'value' };

// Save data to localStorage
localStorage.setItem('dummyData', JSON.stringify(dummyData));

// Retrieve data from localStorage
const retrievedData = JSON.parse(localStorage.getItem('dummyData'));
console.log('Retrieved Data:', retrievedData);
