/**
 * Horizon SDK - Basic Usage Example
 * 
 * This example demonstrates how to use the Horizon SDK to:
 * 1. Read mission data from the blockchain
 * 2. Calculate fees
 * 3. Parse and format USDC amounts
 * 
 * To run:
 *   npx ts-node examples/basic-usage.ts
 */

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  BASE_SEPOLIA,
  MissionFactoryABI,
  MissionEscrowABI,
  parseUSDC,
  formatUSDC,
  formatAddress,
  calculateFeeSplit,
  calculateDDR,
  MissionState,
  getBaseScanUrl,
  formatDuration,
} from '../src';

async function main() {
  console.log('🌅 Horizon Protocol SDK - Basic Usage Example\n');

  // Create viem public client
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(BASE_SEPOLIA.rpcUrl),
  });

  // 1. Read mission count
  console.log('📊 Reading mission count...');
  const missionCount = await client.readContract({
    address: BASE_SEPOLIA.contracts.missionFactory,
    abi: MissionFactoryABI,
    functionName: 'missionCount',
  });
  console.log(`   Total missions created: ${missionCount}\n`);

  // 2. If missions exist, read the first one
  if (missionCount > 0n) {
    console.log('📋 Reading mission #1 details...');
    
    const escrowAddress = await client.readContract({
      address: BASE_SEPOLIA.contracts.missionFactory,
      abi: MissionFactoryABI,
      functionName: 'getMission',
      args: [1n],
    });
    
    const params = await client.readContract({
      address: escrowAddress,
      abi: MissionEscrowABI,
      functionName: 'getParams',
    });
    
    const runtime = await client.readContract({
      address: escrowAddress,
      abi: MissionEscrowABI,
      functionName: 'getRuntime',
    });

    console.log(`   Escrow: ${formatAddress(escrowAddress, { separator: '…' })}`);
    console.log(`   Poster: ${formatAddress(params.poster, { start: 6, end: 4, separator: '…' })}`);
    console.log(`   Reward: ${formatUSDC(params.rewardAmount)} USDC`);
    console.log(`   State: ${MissionState[runtime.state]}`);
    console.log(`   BaseScan: ${getBaseScanUrl(escrowAddress, 'address', true)}\n`);
  }

  // 3. Demonstrate fee calculations
  console.log('💰 Fee Calculation Example:');
  const rewardAmount = parseUSDC(100); // 100 USDC
  console.log(`   Reward: ${formatUSDC(rewardAmount)} USDC`);
  
  // Calculate with 3% guild fee
  const fees = calculateFeeSplit(rewardAmount, 300);
  console.log('\n   Fee Breakdown (3% guild fee):');
  console.log(`   • Performer: ${formatUSDC(fees.performerAmount)} USDC (87%)`);
  console.log(`   • Protocol:  ${formatUSDC(fees.protocolAmount)} USDC (4%)`);
  console.log(`   • Labs:      ${formatUSDC(fees.labsAmount)} USDC (4%)`);
  console.log(`   • Resolver:  ${formatUSDC(fees.resolverAmount)} USDC (2%)`);
  console.log(`   • Guild:     ${formatUSDC(fees.guildAmount)} USDC (3%)`);
  
  // Calculate DDR for disputes
  const ddr = calculateDDR(rewardAmount);
  console.log(`\n   DDR (Dispute Reserve): ${formatUSDC(ddr)} USDC per party`);

  // 4. Demonstrate compact formatting
  console.log('\n⏱️ Duration Formatting Example:');
  const durationSecs = 86400 + 3600 + 60; // 1d 1h 1m
  console.log(`   Original: ${formatDuration(durationSecs)}`);
  console.log(`   Max Parts (1): ${formatDuration(durationSecs, { maxParts: 1 })}`);
  console.log(`   Max Parts (2): ${formatDuration(durationSecs, { maxParts: 2 })}`);

  console.log('\n📐 Compact Formatting Example:');
  const largeAmount = parseUSDC(1500000); // 1.5M USDC
  console.log(`   Original: ${formatUSDC(largeAmount)} USDC`);
  console.log(`   Compact:  ${formatUSDC(largeAmount, { compact: true })} USDC`);
  console.log(`   Compact (Prefix): ${formatUSDC(largeAmount, { compact: true, prefix: '$' })}`);
  console.log(`   Compact (Plus Sign): ${formatUSDC(largeAmount, { compact: true, prefix: '$', showPlusSign: true })}`);
  console.log(`   Max Decimals (Truncated): ${formatUSDC(parseUSDC('1.555'), { maxDecimals: 2 })} USDC`);

  // 5. Contract addresses
  console.log('\n📜 Contract Addresses (Base Sepolia):');
  console.log(`   MissionFactory: ${BASE_SEPOLIA.contracts.missionFactory}`);
  console.log(`   GuildFactory:   ${BASE_SEPOLIA.contracts.guildFactory}`);
  console.log(`   PaymentRouter:  ${BASE_SEPOLIA.contracts.paymentRouter}`);
  console.log(`   USDC:           ${BASE_SEPOLIA.contracts.usdc}`);

  console.log('\n✅ Done!');
}

main().catch(console.error);




