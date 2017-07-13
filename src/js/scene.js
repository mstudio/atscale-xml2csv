

export class Scene {

  constructor() {
    this.init();
  }

  init() {
    this.initMouseEvents();
    this.initWindowEvents();
  }

  initMouseEvents() {
    document.addEventListener( 'mousedown', (event) => this.onMouseDown(event), true );
    //document.addEventListener( 'click', (event) => this.onClick(event), true );
    document.addEventListener( 'mouseup', (event) => this.onMouseUp(event), true );
  }



  initWindowEvents() {
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }



  onMouseUp (event) {


  }

  onMouseDown(event) {


  }


}
