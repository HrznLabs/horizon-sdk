const { calculateFeeSplit, FEES, parseUSDC } = require('../dist/index.js');

const reward = parseUSDC('100'); // 100 USDC

console.log('🛡️ Sentinel Security Check: calculateFeeSplit Validation\n');

let passed = true;

// Test 1: Normal Case
try {
  console.log('Test 1: Normal Case (3%)');
  const normalSplit = calculateFeeSplit(reward, 300);
  if (normalSplit.guildAmount !== 3000000n) throw new Error('Incorrect guildAmount');
  console.log('✅ Passed');
} catch (e) {
  console.error('❌ Failed:', e.message);
  passed = false;
}

// Test 2: High Guild Fee (Should Fail)
try {
  console.log('\nTest 2: High Guild Fee (20% > 15% MAX)');
  calculateFeeSplit(reward, 2000);
  console.error('❌ Failed: Should have thrown an error');
  passed = false;
} catch (e) {
  if (e.message.includes('Guild fee must be between 0 and')) {
    console.log('✅ Passed: Caught expected error:', e.message);
  } else {
    console.error('❌ Failed: Unexpected error message:', e.message);
    passed = false;
  }
}

// Test 3: Negative Guild Fee (Should Fail)
try {
  console.log('\nTest 3: Negative Guild Fee (-10%)');
  calculateFeeSplit(reward, -1000);
  console.error('❌ Failed: Should have thrown an error');
  passed = false;
} catch (e) {
  if (e.message.includes('Guild fee must be between 0 and')) {
    console.log('✅ Passed: Caught expected error:', e.message);
  } else {
    console.error('❌ Failed: Unexpected error message:', e.message);
    passed = false;
  }
}

if (!passed) {
  console.error('\n❌ Security checks failed');
  process.exit(1);
} else {
  console.log('\n✅ All security checks passed');
  process.exit(0);
}
