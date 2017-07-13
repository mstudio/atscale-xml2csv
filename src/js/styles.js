/**
 * Misc position/color styles used for the 3d models
 */


class StylesSingleton {
  
  constructor() {
    this.SHOW_LABELS = false;
  }
  
  get initialCameraRotation() {
    return new THREE.Vector3(-2.38, -0.80, -2.54);
  }

  get initialCameraPosition() {
    return new THREE.Vector3(-87, 58, -61);
  }

  getTopColor(index) {
    switch (index) {
      case 0:
        return 0xe6f6ff;
        break;
      case 1:
        return 0x55b0eb;
        break;
      case 2:
        return 0x1b9ff0;
        break;
      case 3:
        return 0x0047ca;
        break;
      case 4:
        return 0x0031b5;
        break;
      case 5:
        return 0x000f99;
        break;
      case 6:
        return 0x000f99;
        break;
      default:
        return 0x131c6a;
        break;
    }
  }
}

export let Styles = new StylesSingleton();