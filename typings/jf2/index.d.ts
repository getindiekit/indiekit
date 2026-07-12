/** JF2 properties. Deliberately loose — JF2 permits arbitrary vocabularies */
type Jf2Properties = Record<string, any>;

interface Jf2PostData {
  /** BSON ObjectId, being refactored out of post data */
  _id?: unknown;
  properties: Jf2Properties;
}
