/**
 * Main app controller, contains events, a dispatcher and a handful of utility functions for dispatching events
 */


export class ControllerSingleton {

  constructor() {
    this.sectionStack = [];
    this.subsectionStack = [];

    // events
    this.GO_SECTION = "OG:GO_SECTION";
    this.HOVER_BOTTOM = "OG:HOVER_BOTTOM";
  }

  /**
   * Dispatch Event
   * @param  {DOM node} element
   * @param  {string} event
   * @param  {Object} payload
   */
  dispatch(element, event, payload) {
    let e = new CustomEvent(event, { detail : payload });
    element.dispatchEvent(e);
  }
  
  goSection(section, subsection, mesh) {
    this.sectionStack.push(section);
    this.subsectionStack.push(subsection);
    this.activeMesh = mesh;
    this.dispatch(window, this.GO_SECTION, { section : section, subsection : subsection } );
  }

  onHoverBottom(index) {
    this.dispatch(window, this.HOVER_BOTTOM, { index : index } );
  }

  get currentSection() {
    return this.sectionStack[this.sectionStack.length - 1];
  }
  get previousSection() {
    return this.sectionStack[this.sectionStack.length - 2];
  }
  get currentSubsection() {
    return this.subsectionStack[this.subsectionStack.length - 1];
  }
}

export let Controller = new ControllerSingleton();