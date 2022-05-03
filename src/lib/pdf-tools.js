import PdfPrinter from "pdfmake"

export const getPdfReadableStream = (book) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }

  const printer = new PdfPrinter(fonts)
  // Generates and download a PDF with the CV of the user (details, picture, experiences)
  const docDefinition = {
    content: [
      {
        text: profile.name,
        style: "header",
      },
      profile.surname,
      {
        text: "Subheader 1 - using subheader style",
        style: "subheader",
      },
      "put here the PATH like profile.name",

      {
        text: "Subheader 2 - using subheader style",
        style: "subheader",
      },
      "put here the PATH like profile.name",

      {
        text: "It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties",
        style: ["quote", "small"],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      small: {
        fontSize: 8,
      },
    },
    defaultStyle: {
      font: "Helvetica",
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}
