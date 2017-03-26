'use strict';

const $ = require('jquery');
import React from 'react';
import { LocalVideo } from '../src/index.jsx';
import renderer from 'react-test-renderer';

describe('LocalVideo', () => {
  it('renders correctly', () => {
    const testLocalConnection = {
      video: {
        index: 0,
        src: "https://xrtc.iris.me/video0",
        track: {
          attach(node) {
            // mock
          }
        },
      },
      audio: {
        index: 1,
        src: "https://xrtc.iris.me/audio1",
      }
    }
    /*const tree = renderer.create(
      <LocalVideo key="1" audio={testLocalConnection.audio} video={testLocalConnection.video} />
    ).toJSON();
    expect(tree).toMatchSnapshot();*/
  });
});
