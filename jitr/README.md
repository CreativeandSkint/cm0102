# iPad engine

Boxedwine single-threaded WASM JIT build (upstream commit 65467424603484756a73308412f40b906d28b650), built with Emscripten 5.0.7 and these changes (`boxedwine-ipad.patch`):

- `CM_BLOCK_CHUNK=512`: ends long straight-line blocks at fixed 512-byte address boundaries. Upstream compiles a separate copy of a whole run of code for every jump target inside it, which on CM 01/02's save loader produced about 2.8 GB of WebAssembly in a few in-game days. Chunked, it settles around 250 MB. Cutting at an address boundary rather than after a fixed op count matters: blocks that start in the same chunk all end at the same instruction, so overlapping blocks still nest the way `KMemory::removeCodeBlock` expects. (An earlier op-count cap broke that rule and tripped `removeCodeBlock nextOp->blockStart` panics, which abort the guest's current syscall.)
- A scheduler hook (`cmMaybeFlushJit`) that clears every process's op cache between thread slices when the page sets `Module.cmJitFlushRequested`. The launcher asks for this when compiled code passes the "Recycle at" limit.

Built with: `make jit WASM_EXCEPTIONS_FLAG=-fwasm-exceptions GCC_EXTRA_FLAGS=-DCM_BLOCK_CHUNK=512`
