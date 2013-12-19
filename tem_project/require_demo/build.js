({
    appDir: "./",
    baseUrl: "js",
    dir: "../require_demo-built",
    paths: {
        jquery: 'empty:',
        a: 'common/a',
        b: 'common/b',
        c: 'common/c',
        d: 'common/d'
    },
    modules: [
        {
            name: "page1/main"
        },
        {
            name: "page2/main"
        }
    ],
    //If set to true, any files that were combined into a build bundle will be
    //removed from the output folder
    removeCombined: true,
    findNestedDependencies: true
})