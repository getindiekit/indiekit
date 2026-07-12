import { mf2 } from "microformats-parser";

declare global {
  /** Result of parsing a document for microformats */
  type Mf2ParsedDocument = ReturnType<typeof mf2>;

  /** A microformat item, i.e. `h-entry`, `h-card`, `h-adr` */
  type MicroformatRoot = Mf2ParsedDocument["items"][number];

  /** Microformat property values, keyed by property name */
  type MicroformatProperties = MicroformatRoot["properties"];

  /** A single microformat property value */
  type MicroformatProperty = MicroformatProperties[string][number];

  /** An mf2 item under construction, before property values are normalised */
  interface Mf2Draft {
    type: string[];
    properties: Record<string, any>;
  }
}
