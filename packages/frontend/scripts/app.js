/* global Stimulus */
import { Application } from "@hotwired/stimulus";
import { ErrorSummaryController } from "../components/error-summary/index.js";
import { GeoInputController } from "../components/geo-input/index.js";
import { PreviewController } from "../components/preview/index.js";
import { NotificationController } from "../components/notification/index.js";
import { TextareaController } from "../components/textarea/index.js";
import { TokenInputController } from "../components/token-input/index.js";

window.Stimulus = Application.start();
Stimulus.register("error-summary", ErrorSummaryController);
Stimulus.register("geo-input", GeoInputController);
Stimulus.register("notification", NotificationController);
Stimulus.register("preview", PreviewController);
Stimulus.register("textarea", TextareaController);
Stimulus.register("token-input", TokenInputController);
