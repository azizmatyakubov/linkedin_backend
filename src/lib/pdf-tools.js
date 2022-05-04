import PdfPrinter from "pdfmake"
import imageToBase64 from "image-to-base64"

export const getPdfReadableStream = (profile) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }

  let profileImage = ""

  // imageToBase64(profile.image) // Path to the image
  //   .then((response) => {
  //     console.log(response) // "cGF0aC90by9maWxlLmpwZw=="
  //     profileImage = response
  //   })
  //   .catch((error) => {
  //     console.log(error) // Logs an error if there was one
  //   })

  const printer = new PdfPrinter(fonts)
  // Generates and download a PDF with the CV of the user (details, picture, experiences)

  const docDefinition = {
    content: [
      // {
      //   image: imageToBase64(profileImage),
      // },
      {
        text: [profile.name, profile.surname],
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
