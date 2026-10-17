/** JF2 properties. Deliberately loose — JF2 permits arbitrary vocabularies */
type Jf2Properties = Record<string, any>;

interface Jf2PostData {
  /** BSON ObjectId, being refactored out of post data */
  _id?: unknown;
  _deletedProperties?: Jf2Properties;
  _originalPath?: string;
  path: string;
  properties: Jf2Properties;
}

interface Jf2MediaData {
  /** BSON ObjectId, being refactored out of media data */
  _id?: unknown;
  _deletedProperties?: Jf2Properties;
  _originalPath?: string;
  path: string;
  properties: Jf2Properties;
}

interface Jf2MediaItem {
  url?: string;
  alt?: string;
}
