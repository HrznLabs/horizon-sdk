
import { calculateFeeSplit } from './src/utils/index';

try {
  console.log('Testing fractional BPS...');
  calculateFeeSplit(10000n, 100.5);
} catch (e) {
  console.log('Caught expected error:', e);
}

try {
  console.log('Testing integer BPS...');
  const res = calculateFeeSplit(10000n, 100);
  console.log('Success:', res);
} catch (e) {
  console.log('Unexpected error:', e);
}
