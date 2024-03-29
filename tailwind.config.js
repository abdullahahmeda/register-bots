module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: {
    content: ['./views/**/*.html'],
    css: ['./src/css/main.css'],
    output: ['./public/css/main.css']
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
}
