class HelloWorld {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {

        if (compiler.hooks) {
            console.log("======= Hello world : Compiler Hooks ===========");
            var plugin = { name: 'HelloWorld' };

            compiler.hooks.watchRun.tap('HelloWorld', (compilation, callback) => {
                console.log("======= Hello world 1 : Compile ===========");
                if (callback) {
                    callback();
                }
            })

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

module.exports = HelloWorld;
