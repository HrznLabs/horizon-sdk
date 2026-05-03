
## 2024-05-22 - Redundant Fee Calculation Optimization
**Learning:** Reusing calculated BigInt values in `calculateFeeSplit` when BPS constants are identical (Protocol & Labs) reduced execution time by ~20% (636ms -> 507ms for 1M iterations).
**Action:** Always check for redundant calculations in mathematical utility functions, especially those involving BigInt division which is relatively expensive.

## 2024-05-22 - Broken Regression Test Discovery
**Learning:** Regression tests may contain outdated expectations (e.g., hardcoded fee amounts based on old BPS values) that mask the true behavior of the code. In this case, `test/fee-split.test.ts` expected 400n (4%) but code produced 250n (2.5%), causing failure only when verified.
**Action:** When tests fail unexpectedly during optimization, verify if the test expectations align with the current constants/configuration before assuming the code is broken.

## 2024-05-23 - Uint8Array Hoisting in randomBytes32
**Learning:** Hoisting a `Uint8Array` buffer to module scope in `randomBytes32` to avoid repeated allocation reduced execution time by ~21% (461ms -> 364ms for 100k iterations).
**Action:** Look for other utility functions that allocate buffers or arrays repeatedly in hot paths and hoist them if thread-safety permits.

## 2024-05-24 - Pre-allocation of Constants in formatDuration
**Learning:** Hoisting configuration objects (like `TIME_UNITS`) to module scope in `formatDuration` avoids allocating new objects and arrays on every function call. While unrolling the loop provided slightly better micro-benchmark results (~17% improvement), the readability cost was deemed too high. Pre-allocating the arrays provided a balanced optimization by reducing GC pressure without sacrificing code clarity.
**Action:** Identify functions that re-create static configuration objects/arrays on every invocation and hoist them to module scope.

## 2026-04-09 - [Optimize getBaseScanUrl regex]
**Learning:** Using multiple regex checks with length quantifiers (like `/^0x[0-9a-fA-F]{40}$/` and `/^0x[0-9a-fA-F]{64}$/`) inside frequently called functions creates significant instantiation overhead and forces the regex engine to parse both the string contents and its length. By moving the length check to an $O(1)$ fast check (`len === 42 || len === 66`), and hoisting a generic hexadecimal regex (`/^0x[0-9a-fA-F]+$/`), we avoid allocating two new Regex instances per call and provide an early bypass for incorrectly-sized inputs.
**Action:** Always hoist generic string-validation regular expressions and rely on explicit conditional branching (`if`, `switch`) for length-based constraints rather than encoding length logic into the pattern itself if it occurs in a hot path.

## 2024-05-25 - Substring & Concatenation > Slice & Template Literals
**Learning:** Using `substring` and direct string concatenation (`+`) instead of `slice` (specifically negative slice like `slice(-4)`) and template literals reduces execution time significantly (~40% reduction for `formatAddress` in micro-benchmarks). The V8 engine optimizes `substring` and `+` more effectively for these specific types of common string manipulations.
**Action:** When writing high-throughput functions that perform simple string truncation and concatenation, prefer `substring` with calculated lengths and direct `+` concatenation over `slice` with negative indices and template literals.

## 2024-05-15 - [formatDuration Array Join vs String Concatenation]
**Learning:** In highly-called utility functions formatting strings (like `formatDuration`), repeatedly allocating array elements using `.push()` and then joining them via `.join(' ')` incurs a significant performance overhead compared to straightforward string concatenation (`+=`).
**Action:** Default to simple string operations (concatenation, `substring`) over array allocations or complex methods for performance-critical string builders in this codebase. Always add quick checks to skip math operations where possible.

## 2024-12-04 - [Optimize getBaseScanUrl Construction]
**Learning:** For short, frequently called URL construction utilities like `getBaseScanUrl`, combining input validation checks into a single short-circuiting expression (`||`) and using direct string concatenation (`+`) instead of ES6 template literals (`${}`) is significantly faster. In Node.js / V8, simple string concatenation avoids the overhead of creating template arrays and parsing nested variables. Combining boolean validations also avoids variable assignment overhead, increasing execution speed by ~20%.
**Action:** Default to boolean operators `||` for chained fast-fail validations. Default to direct string concatenation instead of template strings for simple URL or path construction in high-frequency utilities.

## 2026-03-14 - [String Concatenation in Return Statements]
**Learning:** In utility functions that format strings like `formatBps` and `formatUSDC`, replacing final return template literals (e.g., `` `${sign}${prefix}${wholeStr}${suffix}` ``) with direct string concatenation (`sign + prefix + wholeStr + suffix`) reduces execution time by ~25-40% depending on the function. This is consistent with previous learnings, as the V8 engine optimizes direct string concatenation heavily compared to the allocation overhead of parsing template arrays.
**Action:** Always prefer direct string concatenation (`+`) over template literals (`${}`) for simple variable joining in high-throughput formatting functions.

## 2024-12-05 - formatDuration Early Exit
**Learning:** In loops that subtract or divide down a value (like time formatting), once the value reaches zero, continuing to iterate through smaller units is wasted CPU time.
**Action:** Always add an early exit condition (`if (remaining === 0) break;`) to formatting loops to skip unnecessary iterations.

## 2024-12-06 - Hoist large BigInt constants
**Learning:** In utility functions called frequently, defining large `BigInt` constants inside a function body or `if` block forces the JavaScript engine to allocate and garbage-collect those values on every execution. Hoisting `BigInt` constants to the module scope avoids this overhead. In `formatUSDC` with `compact: true`, hoisting the K/M/B/T thresholds yielded a ~12% performance improvement.
**Action:** Always hoist static, immutable configuration data and large constants (`BigInt` values, regexes, complex arrays) to module scope instead of defining them locally inside high-throughput functions.

## 2024-05-15 - Optimize string-to-BigInt accumulation in `parseUSDC`
**Learning:** For functions parsing decimals into BigInt (e.g., `parseUSDC`), accumulating all parsed digits into a single BigInt variable (`totalVal = totalVal * 10n + digit`) and using the `fracLen` variable to apply the scaling exponent at the end is ~5-15% faster than maintaining separate `intPart` and `fracPart` accumulators and checking an `inFraction` branch on every digit loop.
**Action:** When manually parsing fixed-point numbers from strings to BigInts, eliminate branching logic inside tight parsing loops by keeping a single accumulator and modifying scaling factors based on loop states like `fracLen`.

## 2026-04-09 - formatUSDC manual comma insertion optimization
**Learning:** Using `substring` is significantly faster than `slice` for string partition and concatenation in V8. The execution time for `formatUSDC` reduces by ~30% when applying this to manual comma insertion.
**Action:** When manually parsing and reformatting large numeric strings, prefer `substring` with concatenation over `slice`.

## 2024-12-07 - PadEnd Replacement Optimization
**Learning:** In utility functions, native string padding methods like `.padEnd(length, char)` allocate strings dynamically and evaluate relatively slowly compared to substring concatenation from pre-allocated padding strings. In `toBytes32`, using `str + ZEROES.substring(0, 66 - str.length)` instead of `str.padEnd(66, '0')` yields a significant ~15-20x speedup in micro-benchmarks by avoiding dynamic allocation and taking advantage of V8's fast string concatenation.
**Action:** When fixed-character padding is required in high-frequency functions (e.g. zero-padding or space-padding), pre-allocate a long string of the required character and use `str + padding.substring(0, targetLength - str.length)` instead of native `.padStart()` or `.padEnd()`.

## 2024-12-08 - BigInt Literal vs Module Constant Optimization
**Learning:** In short math utility functions (like `calculateDDR` and `calculateLPP`), replacing a hoisted module-scoped constant (`BPS_DIVISOR = BigInt(10000)`) with a local BigInt literal (`10000n`) bypasses memory access overhead and yields a surprisingly large performance boost (~25% speedup in V8).
**Action:** For simple, highly-called arithmetic functions, prefer using BigInt literals (e.g., `10000n`) directly instead of referencing hoisted module variables.

## 2024-05-14 - BigInt Conversion and Short-Circuiting
**Learning:** In V8, converting a variable to `BigInt` (e.g. `BigInt(guildFeeBps)`) inside a mathematical operation that often evaluates to zero is surprisingly expensive. Using `BigInt(10000)` instead of the literal `10000n` also adds constructor overhead.
**Action:** When performing BigInt math with a variable that is frequently `0` (like `guildFeeBps`), implement a short-circuit (e.g. `guildFeeBps === 0 ? 0n : ...`) to skip the `BigInt` conversion and math entirely. Always use `n` literals (e.g., `10000n`) for BigInt constants instead of the `BigInt()` constructor.

## 2024-05-26 - [Optimize toBytes32 string encoding]
**Learning:** In the `toBytes32` utility function, encoding string bytes natively using `TextEncoder.prototype.encode()` instantiates a new `Uint8Array` each time. By pre-allocating a `Uint8Array` of size 33 and replacing the usage with `TextEncoder.prototype.encodeInto()`, we avoid dynamic array allocations entirely. The 33-byte size allows us to detect and securely fail for string encodings that exceed the 32 byte maximum length. Micro-benchmarks show an execution speedup of approximately 4x (~75% execution time reduction) for valid byte conversions.
**Action:** Always prefer `encodeInto` with a module-scoped pre-allocated buffer over `encode` in high-throughput hot paths that do not require concurrent processing.

## 2024-12-09 - [Optimize randomBytes32 template literal]
**Learning:** In string generation utilities like `randomBytes32` that need a `0x` prefix, initializing the loop accumulator variable with `'0x'` upfront (`let hex = '0x'`) and directly returning the string avoids ES6 template literal evaluation overhead (`return \`0x\${hex}\``) at the end. In local micro-benchmarks, avoiding the final template literal allocation and interpolation yielded a roughly ~10% execution time reduction.
**Action:** When generating prefixed strings (like hex codes or addresses) iteratively, initialize the accumulator with the prefix rather than appending the prefix at the end using template literals.
## 2024-12-10 - Number vs BigInt Accumulation Optimization
**Learning:** In string parsing functions like `parseUSDC`, accumulating digits directly into a `BigInt` variable forces V8 to allocate BigInt memory heavily on every iteration. By accumulating into a native `Number` first, and only switching to `BigInt` if the value exceeds safe bounds (e.g. `900,000,000,000,000`), we reduce BigInt allocations dramatically. Micro-benchmarks show this reduces `parseUSDC` execution time by ~40% for typical numbers.
**Action:** When manually calculating fixed-point numeric strings, use a `Number` accumulator inside the hot loop and transition to `BigInt` math only if the number exceeds JavaScript's max safe integer threshold (`~9e15`).

## 2026-04-26 - [Optimize Hex String Validation]
**Learning:** For short, fixed-pattern string validations on frequent hot paths (like checking if a string contains only valid hex characters in `toBytes32`), a manual `charCodeAt` loop with simple bound checks (e.g., `code >= 48 && code <= 57`) is faster than a hoisted Regular Expression (`/^0x[0-9a-fA-F]*$/`). In local benchmarks, removing the Regex in favor of the loop reduced execution time by ~25% because it bypasses the Regex engine overhead and can exit early without any internal allocations.
**Action:** When validating simple string formats in high-frequency utilities, prefer manual `for` loops with `charCodeAt` evaluations over `RegExp.test`, even if the Regex is pre-compiled and hoisted.
## 2024-12-10 - [Optimize formatUSDC compact remainder]
**Learning:** In the `formatUSDC` compact formatting path, exact multiples (e.g. 500K) produce a zero remainder. Because calculating `(0n * 100n) / divisor` involves potentially costly BigInt arithmetic without value, wrapping the fractional value calculation in a ternary short-circuit `remainder === 0n ? 0n : (remainder * 100n) / divisor` yields a significant speedup for numbers that cleanly divide into K/M/B/T thresholds.
**Action:** Always short-circuit BigInt multiplication and division paths when operands are known to be zero in frequent paths.

## 2024-12-10 - [Optimize parseUSDC Bitwise XOR]
**Learning:** In tight string parsing loops (like `parseUSDC`), replacing standard dual-range bounds checking (`code >= 48 && code <= 57`) and subtraction (`code - 48`) with a bitwise XOR (`const digit = code ^ 48; if (digit <= 9)`) combines digit extraction and boundary validation into a single short-circuiting operation. In local micro-benchmarks, this reduces loop execution time by approximately 10% in V8 engines due to fewer CPU instructions and branches.
**Action:** When manually parsing standard ASCII numeric strings in highly-frequent hot paths, prefer bitwise XOR evaluation for extracting and validating digits.
