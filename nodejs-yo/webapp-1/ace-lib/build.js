({
    appDir: "./",
    baseUrl: "./",
    dir: "./test-built",
    paths: {
        jquery: 'empty:',
        testTpl: 'test/ejs/test.ejs',
        b: 'ace-ejs'
    },
    modules: [
        {
            name: "test/ejs/main"
        }
    ],
    //If set to true, any files that were combined into a build bundle will be
    //removed from the output folder
    removeCombined: true,
    findNestedDependencies: true
})