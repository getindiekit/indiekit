/* global window, Stimulus */
import { Application } from "@hotwired/stimulus";

import { ErrorSummaryController } from "../components/error-summary/index.js";
import { PreviewController } from "../components/preview/index.js";
import { TextareaController } from "../components/textarea/index.js";
import { TokenInputController } from "../components/token-input/index.js";

window.Stimulus = Application.start();
Stimulus.register("error-summary", ErrorSummaryController);
Stimulus.register("preview", PreviewController);
Stimulus.register("textarea", TextareaController);
Stimulus.register("token-input", TokenInputController);
