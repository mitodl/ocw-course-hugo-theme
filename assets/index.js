import "./scss/course.scss"
import "../node_modules/tippy.js/dist/tippy.css"
import "../node_modules/nanogallery2/src/css/nanogallery2.css"

import "bootstrap"
import Popper from "popper.js"
import tippy from "tippy.js"
import "offcanvas-bootstrap/dist/js/bootstrap.offcanvas.js"
import "shifty"
import "hammerjs"
import "imagesloaded"
import "screenfull"
import "nanogallery2/src/jquery.nanogallery2.core.js"

import { initPdfViewers } from "./js/pdf_viewer"
import { initSentry } from "./js/sentry"
import { initDesktopCourseInfoToggle } from "./js/course_info_toggle"
import { initCourseInfoExpander } from "./js/course_expander"

window.jQuery = $
window.$ = $
window.Popper = Popper

$(document).ready(() => {
  // hacky coming-soon popover
  document.querySelectorAll(".coming-soon").forEach(el => {
    tippy(el, {
      content: "Coming soon!",
      trigger: "click",
      placement: "top"
    })
  })

  initPdfViewers()
  initSentry()
  initDesktopCourseInfoToggle()
  initCourseInfoExpander()
})
