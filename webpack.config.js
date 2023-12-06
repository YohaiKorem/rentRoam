const purgecss = require("@fullhuman/postcss-purgecss");

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
