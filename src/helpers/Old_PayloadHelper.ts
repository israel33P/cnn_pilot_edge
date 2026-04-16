/**
 * Error class used when the payload isn't ready.
 * @see [ready]{@link PayloadHelper#ready}.
 */
class PayloadNotReadyError extends Error {
  constructor() {
    super('Payload host is not ready.');
    this.name = this.constructor.name;
  }
}

/**
 * Error class used when a field not exists.
 * @see [fieldExists]{@link PayloadHelper#fieldExists}.
 */
class FieldNotExistsError extends Error {
  constructor() {
    super('This field is not defined in the payload.');
    this.name = this.constructor.name;
  }
}

/**
 * Error class used when a field doen't match a given field type.
 * @see [fieldTypeMatches]{@link PayloadHelper#fieldTypeMatches}.
 */
class FieldTypeNotMatchError extends Error {
  constructor() {
    super(`The field type doesn't match to the used function.`);
    this.name = this.constructor.name;
  }
}

type FieldType = { mediatype: string; xsdtype: string | null };
const FIELD_TYPES: { [key: string]: FieldType } = {
  boolean: { mediatype: 'text/plain', xsdtype: 'boolean' },
  color: { mediatype: 'text/vnd.vizrt.color', xsdtype: null },
  date: { mediatype: 'text/plain', xsdtype: 'date' },
  dateTime: { mediatype: 'text/plain', xsdtype: 'dateTime' },
  decimal: { mediatype: 'text/plain', xsdtype: 'decimal' },
  duplet: { mediatype: 'application/vnd.vizrt.duplet', xsdtype: null },
  font: { mediatype: 'application/vnd.vizrt.viz.font', xsdtype: null },
  formattedText: { mediatype: 'application/vnd.vizrt.richtext+xml', xsdtype: null },
  geometry: { mediatype: 'application/vnd.vizrt.viz.geom', xsdtype: null },
  image: { mediatype: 'application/atom+xml;type=entry;media=image', xsdtype: null },
  integer: { mediatype: 'text/plain', xsdtype: 'integer' },
  map: { mediatype: 'application/vnd.vizrt.curious.map', xsdtype: null },
  material: { mediatype: 'application/vnd.vizrt.viz.material', xsdtype: null },
  multiLineText: { mediatype: 'text/plain', xsdtype: 'string' },
  singleLineText: { mediatype: 'text/plain', xsdtype: 'normalizedString' },
  triplet: { mediatype: 'application/vnd.vizrt.triplet', xsdtype: null },
  video: { mediatype: 'application/atom+xml;type=entry;media=video', xsdtype: null },
} as const;

const xmlDoc = document.implementation.createDocument('', '', null);
const emptyXMLEntry = xmlDoc.createElement('entry');

type FunctionElement = { func: Function; fieldId: string };
/**
 * A queue that contains items of type FunctionElement. A FunctionElement
 * contains a fieldId and a function that sets the content of the corresponding
 * field. If two elements will be added within a given time we use the
 * updatePayload function.
 */
class FunctionQueue {
  private items: Array<FunctionElement>;
  private timer: ReturnType<typeof setTimeout>;
  private timeout: number;

  constructor(timeout: number = 100) {
    this.items = [];
    this.timer = setTimeout(() => {}, 0);
    this.timeout = timeout;
  }

  public enqueue(element: FunctionElement): void {
    clearTimeout(this.timer);
    this.items = this.items.filter((el) => el.fieldId !== element.fieldId);
    this.items.push(element);
    this.timer = setTimeout(() => this.callAll(), this.timeout);
  }

  public dequeue(): FunctionElement | undefined {
    return this.items.shift();
  }

  public callNext(): void {
    const nextFunction = this.dequeue();
    if (nextFunction) {
      nextFunction.func();
    }
  }

  public callAll(): void {
    if (this.items.length > 1) {
      PayloadHelper.updatePayload(() => {
        while (this.items.length > 0) {
          this.callNext();
        }
      });
    } else {
      this.callNext();
    }
  }
}

const functionQueue = new FunctionQueue();

/**
 * This class contains functions for accessing the payload of a template
 */
export class PayloadHelper {
  public static isXmlInput(input: string | Element | null): Boolean {
    const domParser = new DOMParser();
    if (domParser.parseFromString(input as string, 'application/xml').querySelector('parsererror')) {
      return false;
    }
    return true;
  }

  /**
   * Returns the payloadhosting object
   * @function PayloadHelper#object
   * @returns {vizrt.PayloadHosting} The payloadhosting object
   */
  public static object() {
    return (window as any).vizrt.payloadhosting;
  }

  /**
   * Initiliases the payload
   * @function PayloadHelper#initialise
   * @returns {Promise<void>} The resolveable promise to react on successfull initialisation
   */
  public static initialise(): Promise<void> {
    return new Promise((resolve: (value?: any) => void, reject: (reason: string) => void) => {
      PayloadHelper.object().initialize(() => {
        console.log('Payload host initialised.');
        resolve('Payload host initialised.');
      });
    });
  }

  /**
   * Returns whether the payload is ready to be used
   * @function PayloadHelper#ready
   * @returns {boolean} True if the payload is usable, false otherwise
   */
  public static ready(): boolean {
    try {
      if (!PayloadHelper.object() || !PayloadHelper.object().isPayloadReady()) throw new PayloadNotReadyError();
      return true;
    } catch (error) {
      if (error instanceof PayloadNotReadyError) {
        console.error(`${error.name}: ${error.message}`);
      }
      return false;
    }
  }

  /**
   * Checks whether a fiels exists with a given fieldId
   * @function PayloadHelper#fieldExists
   * @param {string} fieldId - The ID of the field
   * @returns {boolean} True if the field exists, false otherwise
   */
  public static fieldExists(fieldId: string): boolean {
    try {
      if (!PayloadHelper.object().fieldExists(fieldId)) throw new FieldNotExistsError();
      return true;
    } catch (error) {
      if (error instanceof FieldNotExistsError) {
        console.error(`${error.name}: ${error.message} for field ${fieldId}`);
      }
      return false;
    }
  }

  /**
   * Checks whether a field type matches with the field of the given field ID.
   * @function PayloadHelper#fieldTypeMatches
   * @param {string} fieldID - The ID of the field
   * @param {FieldType} fieldType - The desired field type
   * @returns {boolean} True if the field type match, otherwise false
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static fieldTypeMatches(fieldID: string, fieldType: FieldType): boolean {
    try {
      if (PayloadHelper.getFieldType(fieldID) !== fieldType) throw new FieldTypeNotMatchError();
      return true;
    } catch (error) {
      if (error instanceof FieldTypeNotMatchError) {
        console.error(`${error.name}: ${error.message} for field ${fieldID}`);
      }
      return false;
    }
  }

  /**
   * Get the field type
   * @function PayloadHelper#getFieldType
   * @param {string} fieldId - The field id
   * @returns {FieldType} The field type that matches the field properties
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static getFieldType(fieldId: string): FieldType {
    const mediaType = this.getFieldMediaType(fieldId);
    const xsdType = this.getFieldXsdType(fieldId);
    const fieldType = Object.values(FIELD_TYPES).filter((fieldType) => fieldType.mediatype === mediaType && fieldType.xsdtype === xsdType)[0];
    return fieldType;
  }

  /**
   * Returns the xsd type of a given field
   * @function PayloadHelper#getFieldXsdType
   * @param {string} fieldId - The field id
   * @returns {string} The xsd type of the field
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static getFieldXsdType(fieldId: string): string {
    if (!PayloadHelper.ready()) return '';
    if (!PayloadHelper.fieldExists(fieldId)) return '';
    return PayloadHelper.object().getFieldXsdType(fieldId);
  }

  /**
   * Returns the media type of a given field
   * @function PayloadHelper#getFieldMediaType
   * @param {string} fieldId - The field id
   * @returns {string} The media type of the field
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static getFieldMediaType(fieldId: string): string {
    if (!PayloadHelper.ready()) return '';
    if (!PayloadHelper.fieldExists(fieldId)) return '';
    return PayloadHelper.object().getFieldMediaType(fieldId);
  }

  /**
   * Adds an event listener to be able to react on payload changes.
   * @function PayloadHelper#addListener
   * @param {Function} onChange - The callback that is used if the payloadchange event is received
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   */
  public static addListener(onChange: () => void) {
    if (!PayloadHelper.ready()) return;
    PayloadHelper.object().addEventListener('payloadchange', onChange);
  }

  /**
   * Removes an event listener.
   * @function PayloadHelper#removeListener
   * @param {Function} onChange - The callback that is used if the payloadchange event is received
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   */
  public static removeListener(onChange: () => void) {
    if (!PayloadHelper.ready()) return;
    PayloadHelper.object().removeEventListener('payloadchange', onChange);
  }

  /**
   * Adds callbacks to the payload to be able react on field changes.
   * The ID of a field is used as a key in the callbacks object to call the
   * corresponding function.
   * @function PayloadHelper#addFieldValueCallbacks
   * @param {Object} callbacks - Consists of key value pairs where the key is
   *    the id of the field and the value is the corresponding function to be
   *    called when the field changes.
   */
  public static addFieldValueCallbacks(callbacks: { [key: string]: (value: string) => void }): void {
    if (!PayloadHelper.ready()) return;
    PayloadHelper.object()._fieldValueCallbacks = PayloadHelper.object()._fieldValueCallbacks || {};
    PayloadHelper.object().addFieldValueCallbacks(callbacks);
  }

  /**
   * Gets the text content of a field
   * @function PayloadHelper#getFieldText
   * @param {string} fieldId - The field id
   * @returns {string} The value of the field
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static getFieldText(fieldId: string): string {
    if (!PayloadHelper.ready()) return '';
    if (!PayloadHelper.fieldExists(fieldId)) return '';
    return PayloadHelper.object().getFieldText(fieldId);
  }

  /**
   * Gets the xml content of a field
   * @function PayloadHelper#getFieldXml
   * @param {string} fieldId - The field id
   * @returns {Element} The xml element of the field
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static getFieldXml(fieldId: string): Element {
    if (!PayloadHelper.ready()) return emptyXMLEntry;
    if (!PayloadHelper.fieldExists(fieldId)) return emptyXMLEntry;
    return PayloadHelper.object().getFieldXml(fieldId);
  }

  /**
   * Gets the xml content of a field as string
   * @function PayloadHelper#getFieldXmlAsString
   * @param {string} fieldId - The field id
   * @returns {string} The xml element of the field as string
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static getFieldXmlAsString(fieldId: string): string {
    if (!PayloadHelper.ready()) return '';
    if (!PayloadHelper.fieldExists(fieldId)) return '';
    return PayloadHelper.object().getFieldXmlAsString(fieldId);
  }

  /**
   * Sets the text value of a field.
   * @function PayloadHelper#setFieldText
   * @param {string} fieldId - The field id.
   * @param {string} value - The new value of the field.
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static setFieldText(fieldId: string, value: string | null): void {
    if (!PayloadHelper.ready()) return;
    if (!PayloadHelper.fieldExists(fieldId)) return;
    functionQueue.enqueue({ func: () => PayloadHelper.object().setFieldText(fieldId, value ?? ''), fieldId });
  }

  /**
   * Sets the xml value of a field.
   * @function PayloadHelper#setFieldXml
   * @param {string} fieldId - The field id.
   * @param {Element | null} value - The new value of the field (null for resetting).
   * @throws {Error} Throws an <code>Error</code> if not <code>[ready]{@link PayloadHelper#ready}()</code>.
   * @throws {Error} Throws an <code>Error</code> if not <code>[fieldExists]{@link PayloadHelper#fieldExists}()</code>.
   */
  public static setFieldXml(fieldId: string, value: string | Element | null): void {
    if (!PayloadHelper.ready()) return;
    if (!PayloadHelper.fieldExists(fieldId)) return;
    functionQueue.enqueue({ func: () => PayloadHelper.object().setFieldXml(fieldId, value), fieldId });
  }

  /**
   * Sets an image to an image field.
   * @function PayloadHelper#setImage
   * @param {string} fieldId - The field id.
   * @param {string | Element | null} value - The image value. Can be a viz
   *    uuid of an image in the graphic hub, a path to an image in the graphic
   *    hub or an xml element. null will reset the field.
   * @throws {Error} Throws an <code>FieldTypeNotMatchError</code> if the given field type not matches.
   * @see [fieldTypeMatches]{@link PayloadHelper#fieldTypeMatches}.
   */
  public static setImage(fieldId: string, value: string | Element | null): void {
    if (!this.fieldTypeMatches(fieldId, FIELD_TYPES.image)) return;
    let xmlValue = null;

    if (typeof value === 'string') {
      const elementRegexp: RegExp = /<entry.+<content.+content>.+entry>/s;
      if (value.match(elementRegexp)) {
        xmlValue = value;
      } else {
        value = value.replace(/\w+\*/, '');
        const uuidRegexp: RegExp = /\p{Hex_Digit}{8}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-(\p{Hex_Digit}{16}|\p{Hex_Digit}{4}-\p{Hex_Digit}{12})/gmu;
        const pathRegexp: RegExp = /\w+(\/{1}\w+)*/g;
        const uuidMatch = value.match(uuidRegexp);
        const pathMatch = value.replaceAll(/\\/g, '/').match(pathRegexp);
        if (uuidMatch) {
          xmlValue = `<entry xmlns="http://www.w3.org/2005/Atom"><content type="application/vnd.vizrt.viz.image">IMAGE*&lt;${uuidMatch}&gt;</content></entry>`;
        } else if (pathMatch) {
          xmlValue = `<entry xmlns="http://www.w3.org/2005/Atom"><content type="application/vnd.vizrt.viz.image">IMAGE*${pathMatch}</content></entry>`;
        }
      }
    }
    PayloadHelper.setFieldXml(fieldId, xmlValue);
  }

  /**
   * Sets an image to an image field.
   * @function PayloadHelper#setVideo
   * @param {string} fieldId - The field id.
   * @param {string | Element | null} value - The video value. Can be a viz
   *    uuid of an video in the graphic hub, a path to an video in the graphic
   *    hub or an xml element. null will reset the field.
   * @throws {Error} Throws an <code>FieldTypeNotMatchError</code> if the given field type not matches.
   * @see [fieldTypeMatches]{@link PayloadHelper#fieldTypeMatches}.
   */
  public static setVideo(fieldId: string, value: string | Element | null): void {
    if (!this.fieldTypeMatches(fieldId, FIELD_TYPES.video)) return;
    let xmlValue = null;

    if (typeof value === 'string') {
      const elementRegexp: RegExp = /<entry.+<content.+content>.+entry>/s;
      if (value.match(elementRegexp)) {
        xmlValue = value;
      } else {
        value = value.replace(/\w+\*/, '');
        const uuidRegexp: RegExp = /\p{Hex_Digit}{8}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-(\p{Hex_Digit}{16}|\p{Hex_Digit}{4}-\p{Hex_Digit}{12})/gmu;
        const pathRegexp: RegExp = /\w+(\/{1}\w+)*/g;
        const uuidMatch = value.match(uuidRegexp);
        const pathMatch = value.replaceAll(/\\/g, '/').match(pathRegexp);
        if (uuidMatch) {
          xmlValue = `<entry xmlns="http://www.w3.org/2005/Atom"><content type="application/vnd.vizrt.viz.video">VIDEO*&lt;${uuidMatch}&gt;</content></entry>`;
        } else if (pathMatch) {
          xmlValue = `<entry xmlns="http://www.w3.org/2005/Atom"><content type="application/vnd.vizrt.viz.video">VIDEO*${pathMatch}</content></entry>`;
        }
      }
    }
    PayloadHelper.setFieldXml(fieldId, xmlValue);
  }

  /**
   * Sets a geoemtry field with the given value.
   * @function PayloadHelper#setGeometry
   * @param {string} fieldId - The field id.
   * @param {string | null} value - The path of the geometry or null to reset.
   *    Can be in the following form:
   *    <ul>
   *      <li><code>GEOM*<XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX></code> - using viz id</li>
   *      <li><code>GEOM*<XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX></code> - using another form of the viz id</li>
   *      <li><code>GEOM*XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</code> - using viz id</li>
   *      <li><code>GEOM*XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX</code> - using another form of the viz id</li>
   *      <li><code>GEOM*.../.../...</code> - using a path to the graphic hub entry</li>
   *      <li><code><XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX></code> - using viz id</li>
   *      <li><code><XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX></code> - using another form of the viz id</li>
   *      <li><code>XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</code> - using viz id</li>
   *      <li><code>XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX</code> - using another form of the viz id</li>
   *      <li><code>.../.../...</code> - using a path to the graphic hub entry</li>
   *    </ul>
   * @throws {Error} Throws an <code>FieldTypeNotMatchError</code> if the given field type not matches.
   * @see [fieldTypeMatches]{@link PayloadHelper#fieldTypeMatches}.
   */
  public static setGeometry(fieldId: string, value: string | null): void {
    if (!this.fieldTypeMatches(fieldId, FIELD_TYPES.geometry)) return;
    let newFieldValue = '';

    if (value) {
      value = value.replace(/\w+\*/, '');
      const uuidRegexp: RegExp = /\p{Hex_Digit}{8}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-(\p{Hex_Digit}{16}|\p{Hex_Digit}{4}-\p{Hex_Digit}{12})/gmu;
      const pathRegexp: RegExp = /\w+(\/{1}\w+)*/g;
      newFieldValue = value.match(uuidRegexp) ? `GEOM*<${value.match(uuidRegexp)}>` : `GEOM*${value.replaceAll(/\\/g, '/').match(pathRegexp)}`;
    }

    PayloadHelper.setFieldText(fieldId, newFieldValue);
  }

  /**
   * Sets a font field with the given value.
   * @function PayloadHelper#setFont
   * @param {string} fieldId - The field id.
   * @param {string | null} value - The path of the font or null to reset.
   *    Can be in the following form:
   *    <ul>
   *      <li><code>FONT*<XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX></code> - using viz id</li>
   *      <li><code>FONT*<XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX></code> - using another form of the viz id</li>
   *      <li><code>FONT*XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</code> - using viz id</li>
   *      <li><code>FONT*XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX</code> - using another form of the viz id</li>
   *      <li><code>FONT*.../.../...</code> - using a path to the graphic hub entry</li>
   *      <li><code><XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX></code> - using viz id</li>
   *      <li><code><XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX></code> - using another form of the viz id</li>
   *      <li><code>XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</code> - using viz id</li>
   *      <li><code>XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX</code> - using another form of the viz id</li>
   *      <li><code>.../.../...</code> - using a path to the graphic hub entry</li>
   *    </ul>
   * @throws {Error} Throws an <code>FieldTypeNotMatchError</code> if the given field type not matches.
   * @see [fieldTypeMatches]{@link PayloadHelper#fieldTypeMatches}.
   */
  public static setFont(fieldId: string, value: string | null): void {
    if (!this.fieldTypeMatches(fieldId, FIELD_TYPES.font)) return;
    let newFieldValue = '';

    if (value) {
      value = value.replace(/\w+\*/, '');
      const uuidRegexp: RegExp = /\p{Hex_Digit}{8}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-(\p{Hex_Digit}{16}|\p{Hex_Digit}{4}-\p{Hex_Digit}{12})/gmu;
      const pathRegexp: RegExp = /\w+(\/{1}\w+)*/g;
      newFieldValue = value.match(uuidRegexp) ? `FONT*<${value.match(uuidRegexp)}>` : `FONT*${value.replaceAll(/\\/g, '/').match(pathRegexp)}`;
    }

    PayloadHelper.setFieldText(fieldId, newFieldValue);
  }

  /**
   * Sets a font field with the given value.
   * @function PayloadHelper#setMaterial
   * @param {string} fieldId - The field id.
   * @param {string | null} value - The path of the material or null to reset.
   *    Can be in the following form:
   *    <ul>
   *      <li><code>MATERIAL*<XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX></code> - using viz id</li>
   *      <li><code>MATERIAL*<XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX></code> - using another form of the viz id</li>
   *      <li><code>MATERIAL*XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</code> - using viz id</li>
   *      <li><code>MATERIAL*XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX</code> - using another form of the viz id</li>
   *      <li><code>MATERIAL*.../.../...</code> - using a path to the graphic hub entry</li>
   *      <li><code><XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX></code> - using viz id</li>
   *      <li><code><XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX></code> - using another form of the viz id</li>
   *      <li><code>XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</code> - using viz id</li>
   *      <li><code>XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX</code> - using another form of the viz id</li>
   *      <li><code>.../.../...</code> - using a path to the graphic hub entry</li>
   *    </ul>
   * @throws {Error} Throws an <code>FieldTypeNotMatchError</code> if the given field type not matches.
   * @see [fieldTypeMatches]{@link PayloadHelper#fieldTypeMatches}.
   */
  public static setMaterial(fieldId: string, value: string | null): void {
    if (!this.fieldTypeMatches(fieldId, FIELD_TYPES.material)) return;
    let newFieldValue = '';

    if (value) {
      value = value.replace(/\w+\*/, '');
      const uuidRegexp: RegExp = /\p{Hex_Digit}{8}-\p{Hex_Digit}{4}-\p{Hex_Digit}{4}-(\p{Hex_Digit}{16}|\p{Hex_Digit}{4}-\p{Hex_Digit}{12})/gmu;
      const pathRegexp: RegExp = /\w+(\/{1}\w+)*/g;
      newFieldValue = value.match(uuidRegexp) ? `MATERIAL*<${value.match(uuidRegexp)}>` : `MATERIAL*${value.replaceAll(/\\/g, '/').match(pathRegexp)}`;
    }

    PayloadHelper.setFieldText(fieldId, newFieldValue);
  }

  public static editField(field: string, editRequestParameters?: object) {
    if (!PayloadHelper.ready()) return;
    if (!PayloadHelper.fieldExists(field)) return;
    PayloadHelper.object().editField(field, editRequestParameters);
  }

  /**
   * Updates multiple fields but calls the payloadchange event only once at the
   * end.
   * @function PayloadHelper#updatePayload
   * @function
   * @param {Function} updater - A function that contains all function calls to
   *    set the values. That means it contains multiple calls of setFieldText()
   *    and setFieldXml().
   */
  public static updatePayload(updater: Function): void {
    PayloadHelper.object().updatePayload(updater);
  }

  public static swapFieldValues(field1: string, field2: string) {
    if (!PayloadHelper.ready()) return;
    if (!PayloadHelper.fieldExists(field1)) return;
    if (!PayloadHelper.fieldExists(field2)) return;
    const mediaType1 = this.getFieldMediaType(field1);
    const mediaType2 = this.getFieldMediaType(field2);
    if (mediaType1 !== mediaType2) return;
    let value;
    if (mediaType1.includes('+xml')) {
      value = this.getFieldXml(field1);
      this.setFieldXml(field1, this.getFieldXml(field2));
      this.setFieldXml(field2, value);
    } else {
      value = this.getFieldText(field1);
      this.setFieldText(field1, this.getFieldText(field2));
      this.setFieldText(field2, value);
    }
  }

  public static setFieldVisibility(field: string, visibility: boolean | null): void {
    if (!PayloadHelper.ready()) return;
    if (!PayloadHelper.fieldExists(field)) return;
    PayloadHelper.object().setFieldVisibility(field, visibility);
  }

  public static getAllFields(): Array<string> {
    if (!PayloadHelper.ready()) return [];
    const payloadDoc = PayloadHelper.object()._payloadDoc.querySelector('payload');
    const fields: Array<HTMLElement> = Array.from(payloadDoc.querySelectorAll(':scope > field'));
    return fields.map((field: HTMLElement): string => field.getAttribute('name') || '');
  }

  public static setAllFieldsVisibility(visibility: boolean | null): void {
    const allFields: Array<string> = PayloadHelper.getAllFields();
    allFields.forEach((field) => PayloadHelper.setFieldVisibility(field, visibility));
  }
}
