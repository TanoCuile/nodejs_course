const hostParameterConfiguration = {
  default: 'localhost',
  description: 'Host for running server',
  type: 'string',
};
const portParameterConfigurtion = {
  description: 'Port for running server',
  type: 'number',
  default: 3000,
};
const HOST_PARAMETER_NAME = 'host';
const PORT_PARAMETER_NAME = 'port';

module.exports = {
  hostParameterConfiguration,
  portParameterConfigurtion,
  HOST_PARAMETER_NAME,
  PORT_PARAMETER_NAME,
};
