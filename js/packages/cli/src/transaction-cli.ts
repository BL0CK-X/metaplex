#!/usr/bin/env ts-node
import * as fs from 'fs';
import { program } from 'commander';
import { CACHE_PATH } from './helpers/constants';
import log from 'loglevel';
import { web3 } from '@project-serum/anchor';

program.version('0.0.2');

if (!fs.existsSync(CACHE_PATH)) {
  fs.mkdirSync(CACHE_PATH);
}

log.setLevel(log.levels.INFO);

programCommand('get_transaction_info').action(async (options, cmd) => {
  const { env } = cmd.opts();

  const signature =
    '5wHu1qwD7q5ifaN5nwdcDqNFo53GJqa7nLp2BeeEpcHCusb4GzARz4GjgzsEHMkBMgCJMGa6GSQ1VG96Exv8kt2W';
  const solConnection = new web3.Connection(env);

  const transaction = await solConnection.getParsedConfirmedTransaction(
    signature,
    'confirmed',
  );

  console.log(JSON.stringify(transaction));
});

function programCommand(name: string) {
  return program
    .command(name)
    .option(
      '-e, --env <string>',
      'Solana cluster env name',
      'devnet', //mainnet-beta, testnet, devnet
    )
    .option(
      '-k, --keypair <path>',
      `Solana wallet location`,
      '--keypair not provided',
    )
    .option('-l, --log-level <string>', 'log level', setLogLevel)
    .option('-c, --cache-name <string>', 'Cache file name', 'temp')
    .option('-ca, --config-address <string>', 'Configuration address', 'x');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value, prev) {
  if (value === undefined || value === null) {
    return;
  }
  log.info('setting the log value to: ' + value);
  log.setLevel(value);
}

program.parse(process.argv);
