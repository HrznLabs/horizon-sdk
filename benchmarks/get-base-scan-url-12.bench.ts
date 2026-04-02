// Try early return in getBaseScanUrl to avoid setting baseUrl and pathType if not needed?
// But it's almost always needed, so never mind.

// What about optimizing formatDuration?
import { formatDuration } from '../src/utils/index';
const start1 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatDuration(86400 * 2 + 3600 * 3 + 60 * 4 + 5);
  formatDuration(0);
}
console.log("Original formatDuration:", performance.now() - start1);
