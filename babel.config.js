module.exports = {
    presets: [
        ['next/babel'],
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-transform-private-methods'
      ],
  };
  
