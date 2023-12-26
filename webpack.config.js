const purgecss = require("@fullhuman/postcss-purgecss");
const s = require('../airbnb-backend/public')
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            syntax: "postcss-scss",
            plugins: [
              require("postcss-import"),
              require("autoprefixer"),
              purgecss({
                content: ["./**/*.html"],
                whitelistPatterns: [/^cdk-|mat-/],
              }),
            ],
          },
        },
      },
    ],
  },
};
