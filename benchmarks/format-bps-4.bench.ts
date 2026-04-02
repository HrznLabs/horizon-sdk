const MAX_DECIMALS = 100;

function formatBpsOrig(
  bps: number,
  options?: { minDecimals?: number; prefix?: string; suffix?: string }
): string {
  if (!Number.isFinite(bps)) {
    throw new Error('Basis points must be a finite number');
  }

  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix !== undefined ? options.suffix : '%';

  const sign = bps < 0 ? '-' : '';
  const absBps = Math.abs(bps);
  const percentage = absBps / 100;
  let formatted = percentage.toString();

  if (minDecimals > 0) {
    const dotIndex = formatted.indexOf('.');
    const decimals = dotIndex === -1 ? 0 : formatted.length - dotIndex - 1;
    if (decimals < minDecimals) {
      formatted = percentage.toFixed(minDecimals);
    }
  }

  return sign + prefix + formatted + suffix;
}

function formatBpsOpt(
  bps: number,
  options?: { minDecimals?: number; prefix?: string; suffix?: string }
): string {
  if (!Number.isFinite(bps)) {
    throw new Error('Basis points must be a finite number');
  }

  let formatted: string;
  let minDecimals = 0;
  let prefix = '';
  let suffix = '%';

  const isNegative = bps < 0;
  const absBps = isNegative ? -bps : bps;
  const percentage = absBps / 100;

  if (options) {
    minDecimals = options.minDecimals || 0;
    prefix = options.prefix || '';
    if (options.suffix !== undefined) suffix = options.suffix;

    if (minDecimals > 0) {
      if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;
      formatted = percentage.toString();
      const dotIndex = formatted.indexOf('.');
      const decimals = dotIndex === -1 ? 0 : formatted.length - dotIndex - 1;
      if (decimals < minDecimals) {
        formatted = percentage.toFixed(minDecimals);
      }
    } else {
      formatted = percentage.toString();
    }
  } else {
      formatted = percentage.toString();
  }

  const sign = isNegative ? '-' : '';
  return sign + prefix + formatted + suffix;
}

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  formatBpsOrig(150);
  formatBpsOrig(-250, { minDecimals: 2, prefix: "+", suffix: "%" });
  formatBpsOrig(0);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  formatBpsOpt(150);
  formatBpsOpt(-250, { minDecimals: 2, prefix: "+", suffix: "%" });
  formatBpsOpt(0);
}
console.log("Opt early check:", performance.now() - start2);
