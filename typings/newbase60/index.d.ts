declare module "newbase60" {
  /** Convert between numbers, dates and NewBase60 (sexagesimal) strings */
  const newbase60: {
    /** Days since the Unix epoch, as a NewBase60 string */
    DateToSxg(date: Date): string;
    /** Days since the Unix epoch, zero-padded to a fixed length */
    DateToSxgF(date: Date, formatLength?: number): string;
    IntToSxg(number: number): string;
    /** Zero-padded to a fixed length */
    IntToSxgF(number: number, formatLength?: number): string;
    SxgToInt(sxg: string): number;
    /** Date for a number of days since the Unix epoch */
    SxgToDate(sxg: string): Date;
    /** ISO 8601 timestamp for a number of days since the Unix epoch */
    SxgToISO(sxg: string): string;
  };

  export default newbase60;
}
