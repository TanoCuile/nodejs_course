const path = require('path');

// В цьому файлі ми просто зберігаємо статичні так конфігураційні дані,
// які використовуються в різних місцях проекту
// В подальшому цей файл можна розділити на менші
// - за призначенням,
// - типом даних,
// - а також за відношенням до тих чи інших функціональних частин
const hostParameterConfiguration = {
  default: 'localhost',
  description: 'Host for running server',
  type: 'string',
};
const portParameterConfigurtion = {
  description: 'Port for running server',
  type: 'number',
  default: process.env.PORT,
};
const HOST_PARAMETER_NAME = 'host';
const PORT_PARAMETER_NAME = 'port';
const PATH_TO_DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

module.exports = {
  hostParameterConfiguration,
  portParameterConfigurtion,
  HOST_PARAMETER_NAME,
  PORT_PARAMETER_NAME,
  PATH_TO_DATA_FILE,
};
