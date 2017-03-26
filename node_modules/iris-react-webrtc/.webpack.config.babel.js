import {join} from 'path'

const include = join(__dirname, 'src')

export default {
  entry: './src/index.jsx',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'iris-react-webrtc',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /(\.jsx|\.js)$/, loader: 'babel', include},
      {test: /\.json$/, 'loader': 'json', include},
    ]
  }
}
