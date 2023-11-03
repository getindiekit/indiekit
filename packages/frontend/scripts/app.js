/* global Stimulus */
import { Application } from "@hotwired/stimulus";
import { AddAnotherComponent } from "../components/add-another/index.js";
import { CheckboxesFieldComponent } from "../components/checkboxes/index.js";
import { ErrorSummaryController } from "../components/error-summary/index.js";
import { GeoInputController } from "../components/geo-input/index.js";
import { NotificationBannerController } from "../components/notification-banner/index.js";
import { RadiosController } from "../components/radios/index.js";
import { SharePreviewController } from "../components/share-preview/index.js";
import { TagInputController } from "../components/tag-input/index.js";
import { TextareaController } from "../components/textarea/index.js";

window.Stimulus = Application.start();
customElements.define("add-another", AddAnotherComponent);
customElements.define("checkboxes-field", CheckboxesFieldComponent);
Stimulus.register("error-summary", ErrorSummaryController);
Stimulus.register("geo-input", GeoInputController);
Stimulus.register("notification-banner", NotificationBannerController);
Stimulus.register("radios", RadiosController);
Stimulus.register("share-preview", SharePreviewController);
Stimulus.register("tag-input", TagInputController);
Stimulus.register("textarea", TextareaController);
