/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },

  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  devOptions: {
    /* ... */
  },
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  buildOptions: {
    /* ... */
  },
  testOptions: {
    files: ['src/**/*.test.{ts,tsx}'],
  },
  alias: {
    /* ... */
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },
};
