/* global window, Stimulus */
import { Application } from "@hotwired/stimulus";

import { PreviewController } from "../components/preview/index.js";

window.Stimulus = Application.start();
Stimulus.register("preview", PreviewController);
