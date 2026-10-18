/** JF2 properties. Deliberately loose — JF2 permits arbitrary vocabularies */
type Jf2Properties = Record<string, any>;

/** A geographic location, as an `h-geo` microformat */
interface Jf2GeoProperty {
  type: "geo";
  name?: string;
  /** Coordinates in degrees, minutes and seconds */
  latitude: number;
  longitude: number;
}

interface Jf2PostData {
  /** BSON ObjectId, being refactored out of post data */
  _id?: unknown;
  properties: Jf2Properties;
}
