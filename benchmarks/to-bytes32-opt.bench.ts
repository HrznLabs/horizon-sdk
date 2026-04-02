const TEXT_ENCODER = new TextEncoder();
const HEX_STRINGS: string[] = [];
for (let i = 0; i < 256; i++) {
  HEX_STRINGS.push(i.toString(16).padStart(2, '0'));
}
const HEX_OPT_REGEX = /^0x[0-9a-fA-F]*$/;

export function toBytes32(str: string): `0x${string}` {
  const len = str.length;
  if (len >= 2 && str.charCodeAt(0) === 48 && str.charCodeAt(1) === 120) {
    if (len > 66) {
      throw new Error(
        `String too long for bytes32: ${Math.ceil((len - 2) / 2)} bytes (max 32)`
      );
    }
    if (!HEX_OPT_REGEX.test(str)) {
      throw new Error('Invalid hex string.');
    }
    return str.padEnd(66, '0') as `0x${string}`;
  }
  const bytes = TEXT_ENCODER.encode(str);
  const bytesLen = bytes.length;
  if (bytesLen > 32) {
    throw new Error(
      `String too long for bytes32: ${bytesLen} bytes (max 32)`
    );
  }
  let hex = '0x';
  for (let i = 0; i < bytesLen; i++) {
    hex += HEX_STRINGS[bytes[i]];
  }
  return hex.padEnd(66, '0') as `0x${string}`;
}

export function toBytes32Opt(str: string): `0x${string}` {
  const len = str.length;
  if (len >= 2 && str.charCodeAt(0) === 48 && str.charCodeAt(1) === 120) {
    if (len > 66) {
      throw new Error(
        `String too long for bytes32: ${Math.ceil((len - 2) / 2)} bytes (max 32)`
      );
    }
    if (!HEX_OPT_REGEX.test(str)) {
      throw new Error('Invalid hex string.');
    }
    return str.padEnd(66, '0') as `0x${string}`;
  }
  const bytes = TEXT_ENCODER.encode(str);
  const bytesLen = bytes.length;
  if (bytesLen > 32) {
    throw new Error(
      `String too long for bytes32: ${bytesLen} bytes (max 32)`
    );
  }

  // Optimization: use array join instead of string concatenation
  // Wait, let's see if we can do better. Let's preallocate an array.
  const hexArr = new Array(bytesLen);
  for (let i = 0; i < bytesLen; i++) {
    hexArr[i] = HEX_STRINGS[bytes[i]];
  }
  return ('0x' + hexArr.join('')).padEnd(66, '0') as `0x${string}`;
}

const start1 = performance.now();
for (let i = 0; i < 100000; i++) {
  toBytes32("0x1234");
  toBytes32("hello world this is long");
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 100000; i++) {
  toBytes32Opt("0x1234");
  toBytes32Opt("hello world this is long");
}
console.log("Opt:", performance.now() - start2);
