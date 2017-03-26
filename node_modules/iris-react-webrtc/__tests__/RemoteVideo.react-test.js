'use strict';

import React from 'react';
import { RemoteVideo } from '../src/index.jsx';
import renderer from 'react-test-renderer';

describe('RemoteVideo', () => {
  it('renders correctly', () => {
    const testRemoteConnection = {
      video: {
        index: 'vidoejvbf3',
        src: "https://xrtc.iris.me/video0",
      },
      audio: {
        index: 'audiojvbf3',
        src: "https://xrtc.iris.me/audio1",
      }
    }
    const tree = renderer.create(
      <RemoteVideo key="1" audio={testRemoteConnection.audio} video={testRemoteConnection.video} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
