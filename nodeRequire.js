//NODE reuqire jiexi 
// https://github.com/nodejs/node/blob/v5.x/lib/module.js

// Loads a module at the given file path. Returns that module's
// `exports` property.
Module.prototype.require = function (path) {
    assert(path, 'missing path');
    assert(typeof path === 'string', 'path must be a string');
    return Module._load(path, this, /* isMain */ false);
};


// Check the cache for the requested file.
// 1. If a module already exists in the cache: return its exports object.
// 2. If the module is native: call `NativeModule.require()` with the
//    filename and return the result.
// 3. Otherwise, create a new module for the file and save it to the cache.
//    Then have it load  the file contents before returning its exports
//    object.

Module._load = function (request, parent, isMain) {
    if (parent) {
        debug('Module._load REQUEST %s parent: %s', request, parent.id);
    }

    var filename = Module._resolveFilename(request, parent);

    var cachedModule = Module._cache[filename];
    if (cachedModule) {
        return cachedModule.exports;
    }

    if (NativeModule.nonInternalExists(filename)) {
        debug('load native module %s', request);
        return NativeModule.require(filename);
    }

    var module = new Module(filename, parent);

    if (isMain) {
        process.mainModule = module;
        module.id = '.';
    }

    Module._cache[filename] = module;

    var hadException = true;

    try {
        module.load(filename);
        hadException = false;
    } finally {
        if (hadException) {
            delete Module._cache[filename];
        }
    }

    return module.exports;
};
