class HelloWorld {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {

        if (compiler.hooks) {
            console.log("======= Hello world : Compiler Hooks ===========");
            var plugin = { name: 'HelloWorld' };

            compiler.hooks.compile.tap('HelloWorld', (compilation, callback) => {
                console.log("======= Hello world 1 : compile  ===========");
                if (callback) {
                    callback();
                }
            });

            compiler.hooks.watchRun.tap('HelloWorld', (compilation, callback) => {
                console.log("======= Hello world 1 : watchRun ===========");
                if (callback) {
                    callback();
                }
            });

            compiler.hooks.beforeCompile .tap('HelloWorld', (compilation, callback) => {
                console.log("======= Hello world 1 : beforeCompile  ===========");
                if (callback) {
                    callback();
                }
            });

            compiler.hooks.emit.tapAsync('HelloWorld', (compilation, done) => {
                this.options.test();
                console.log("======= Hello world 2 : Compiler Hooks EMIT ===========");
                done();
            });

            compiler.hooks.afterEmit.tapAsync('HelloWorld', (compilation, done) => {
                console.log("======= Hello world 3 : Compiler Hooks : AFTER EMIT ===========");
                this.options.test();
                done();
            });
        } else {
            compiler.plugin("done", () => {
                console.log("======= Hello world ===========");
            })
        }
    }

    childfunction() {
        console.log('Heello from child');
    }

}

/* class MyPlugin {
    constructor(options) {
        this.options = options;
      }
    apply() {
        if ('hooks' in compiler) {
            compiler.hooks.shouldEmit.tap('MyPlugin', compilation => {
                console.log('Synchronously tapping the compile hook.');
                console.log('should I emit?');
                return true;
            });
        }
    }
} */

module.exports = HelloWorld;
