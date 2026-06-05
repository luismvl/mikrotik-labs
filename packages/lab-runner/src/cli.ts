#!/usr/bin/env node
import { listLabs, getLabDetail, getProgress, validateLabCatalog, getPlatformStatus } from './index.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'validate-labs': {
      const result = await validateLabCatalog();
      if (result.valid) {
        console.log('Lab catalog is valid.');
      } else {
        console.error('Lab catalog validation failed:');
        for (const err of result.errors) {
          console.error(`  - ${err}`);
        }
        process.exit(1);
      }
      break;
    }
    case 'list': {
      const labs = await listLabs();
      console.log(JSON.stringify(labs, null, 2));
      break;
    }
    case 'status': {
      const [progress, platform] = await Promise.all([getProgress(), getPlatformStatus()]);
      console.log(JSON.stringify({ progress, platform }, null, 2));
      break;
    }
    default: {
      console.error(`Unknown command: ${command ?? '(none)'}`);
      console.error('Usage: lab-runner <validate-labs|list|status>');
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
