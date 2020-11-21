const { content, css } = require("./purgecss.config");

module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    purge: {
        content: ['./views/**/*.html'],
        css: ['./src/css/main.css']
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
}
