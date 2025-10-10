declare module 'html3pdf' {
  interface Html3PdfOptions {
    margin?: number;
    filename?: string;
    image?: { type?: 'jpeg' | 'png'; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: { unit?: string; format?: string; orientation?: 'portrait' | 'landscape'; compress?: boolean };
  }

  interface Html3PdfInstance {
    set(options: Html3PdfOptions): Html3PdfInstance;
    from(source: string | HTMLElement): Html3PdfInstance;
    save(): Promise<void>;
  }

  function html3pdf(): Html3PdfInstance;
  export default html3pdf;
}


