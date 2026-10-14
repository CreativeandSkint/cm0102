# iPad engine

Boxedwine single-threaded WASM JIT build (upstream commit 65467424603484756a73308412f40b906d28b650), built with Emscripten 5.0.7 and these changes (`boxedwine-ipad.patch`):

- `CM_MAX_BLOCK_OPS=96`: ends long straight-line blocks early. Upstream compiles a separate copy of a whole run of code for every jump target inside it, which on CM 01/02's save loader produced about 2.8 GB of WebAssembly in a few in-game days. Capped, it settles around 350 MB.
- A scheduler hook (`cmMaybeFlushJit`) that clears every process's op cache between thread slices when the page sets `Module.cmJitFlushRequested`. The launcher asks for this when compiled code passes the "Recycle at" limit.

Built with: `make jit WASM_EXCEPTIONS_FLAG=-fwasm-exceptions GCC_EXTRA_FLAGS=-DCM_MAX_BLOCK_OPS=96`
