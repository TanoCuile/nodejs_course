// Debug packages require('debug')
// process.env.DEBUG = '*';
// Реєструємо синоніми для шляхів модулів проекту
// детальніше: https://www.npmjs.com/package/module-alias#usage
require('module-alias/register');
// Імпортуємо функцію для зчитування команди введеної користувачем
const { runUserCommand } = require('./src/commandProcessor');
// Імпортуємо функцію, яка запустить сервер
const { runServer } = require('./src/server/express');

/**
 * Ініціалізуємо функцію, яка може зродити додаткові перетворення, або вивести необхудну інйормацію
 * перед чи після зупуску срвера
 *
 * @param {RunServerPayload} payload
 * @returns {Promise<any>}
 */
function runServerCallaback(payload) {
  // Запускаємо сервер
  return runServer(payload)
    .then(() => {
      // Після запуску інформуємо користувача
      console.log('It works on', payload.host, payload.port);
    })
    .catch((e) => {
      // При помилці інформуємо користувача
      console.error(e);
      // та закриваємо процес з кодом помилки
      // (1 - стандартний код помилки, в різних додатках бувають різні коди більші 0)
      // (0 - закриття процесу з успіхом)
      process.exit(1);
    });
}

// Зчитуємо команду, яку ввів користувач
// разом з тим передаємо обробник для команди `run`
// якщо в подальшому у нас появиться інша команда ми передамо додатковий обробник
// та змінимо тип вхідних параметрів
runUserCommand(runServerCallaback);


/**
 * Here an description of some useful JsDoc's
 * Keep in mind that JsDoc is just annotation for self management and inline documentation.
 * For plain node - it not have additional functionality and not provide any restrictions.
 * But editors (like VsCode) supports validation and will show you mistakes.
 *
 * But you can find packages which can reed and build project docummentation based on JsDoc.
 *
 * NOTE: JsDoc style which I'm using is not plain JsDock(https://jsdoc.app/) but Closure-like (https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)
 * Playground: https://www.typescriptlang.org/play?useJavaScript=truee=4#example/jsdoc-support
 * Some docs: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */
