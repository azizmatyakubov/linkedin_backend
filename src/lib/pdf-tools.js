import PdfPrinter from "pdfmake"
import axios from "axios"


export const getPdfReadableStream = async(profile) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }


 
  const response = await axios.get(profile.image, {
    responseType: "arraybuffer"
  })

  //  console.log(response.data)

  const blogCoverURLParts = profile.image.split("/");
  const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
  const [id, extension] = fileName.split(".");
  const toBase64 = response.data.toString("base64")
  const base64Image = `data:image/${extension};base64,${toBase64}`
  // console.log(toBase64)
  // console.log(extension)
  
 const printer = new PdfPrinter(fonts)
  // Generates and download a PDF with the CV of the user (details, picture, experiences)

 
  const docDefinition = {
    content: [
      {
        image:base64Image
      },
      {
        text: [profile.name + " " + profile.surname],
        style: "header",
      },

      {
        text: profile.title,
        style: "subheader",
        margin: [0, 10, 0, 10],
      },

      {
        text: profile.email,
        style: "quote",
        margin: [0, 10, 0, 0],
      },
      {
        text: profile.area,
        style: "quote",
        margin: [0, 10, 0, 10],
      },
      {
        text: profile.bio,
        style: "quote",
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
