// 'path'
// 'fs'

const path = require("path");
const fs = require("fs");
const yargs = require('yargs');


const nameOfNewUser = yargs(process.argv).argv.name;

// path.join(['C', 'work']) => 'C\work' 
// path.resolve(['C:\\work', '..', 'progect']) => 'C:\\progect' 

const pathToData = path.resolve(__dirname, '..', 'data', "data.json");
// 'readFileSync' - синхронно читаємо дані файлу
const users = JSON.parse(fs.readFileSync(pathToData).toString());

const newUser = {
  name: nameOfNewUser || 'Bil',
  id: users.users.length + 1,
};

users.users.push(newUser);
// 'writeFileSync' - синхронно записуємо дані файлу
fs.writeFileSync(pathToData, JSON.stringify(users, null, 1));
const content = JSON.stringify(users, null, 1);
// 'writeFile' - робимо асинхронний запит на запис
fs.writeFile(pathToData, content, (err, data) => {
  // Коли буде записано - буде виконано наступний код.
  console.log('Blah 2');
});
// Синхронне виконання продовжиться. І не буде чекати коли 'fs.writeFile' виконається
console.log('Blah 1');
async function loadFinalInfo() {
  console.log('Final ', (await fs.promises.readFile(pathToData) ).toString());
}

setTimeout(()=> loadFinalInfo(), 90000);

