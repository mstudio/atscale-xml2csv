/**
 * Main application
 *
 * Creates 2 views: 3D and 2D
 */

import { Scene } from './scene';
import { Polyfills } from './utils/polyfills';

class Main {
  constructor() {
    Polyfills.init();
    new Scene();
  }

}

document.addEventListener('DOMContentLoaded', event => new Main());
