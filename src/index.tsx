import Vue, {CreateElement, VNode} from 'vue';
import * as React from 'react';
import {render} from 'react-dom';
import {Firebase} from '@nju33/react-firebase';
// import {Authentication} from 'components/authentication';
import {Authentication} from '../dist/index';

const config = {
  apiKey: 'AIzaSyBnvDDDmniFTwB8-GC3VUlWWhpfVigZ3f0',
  authDomain: 'nju333333.firebaseapp.com',
  databaseURL: 'https://nju333333.firebaseio.com',
};

render(
  <Firebase {...config}>
    <Authentication github={true} twitter={true}>
      aksdflasjdf
    </Authentication>
  </Firebase>,
  document.getElementById('app'),
);
