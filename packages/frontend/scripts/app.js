import "@colinaut/action-table";

import { AddAnotherComponent } from "../components/add-another/index.js";
import { CheckboxesFieldComponent } from "../components/checkboxes/index.js";
import { ErrorSummaryComponent } from "../components/error-summary/index.js";
import { EventDurationComponent } from "../components/event-duration/index.js";
import { FileInputFieldController } from "../components/file-input/index.js";
import { GeoInputFieldComponent } from "../components/geo-input/index.js";
import { NotificationBannerComponent } from "../components/notification-banner/index.js";
import { RadiosFieldComponent } from "../components/radios/index.js";
import { SharePreviewComponent } from "../components/share-preview/index.js";
import { TagInputFieldComponent } from "../components/tag-input/index.js";
import { TextareaFieldComponent } from "../components/textarea/index.js";

customElements.define("add-another", AddAnotherComponent);
customElements.define("checkboxes-field", CheckboxesFieldComponent);
customElements.define("error-summary", ErrorSummaryComponent);
customElements.define("file-input-field", FileInputFieldController);
customElements.define("event-duration", EventDurationComponent);
customElements.define("geo-input-field", GeoInputFieldComponent);
customElements.define("notification-banner", NotificationBannerComponent);
customElements.define("radios-field", RadiosFieldComponent);
customElements.define("share-preview", SharePreviewComponent);
customElements.define("tag-input-field", TagInputFieldComponent);
customElements.define("textarea-field", TextareaFieldComponent);
