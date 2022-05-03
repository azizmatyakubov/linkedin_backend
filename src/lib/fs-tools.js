import fs from "fs-extra"
import { fileURLToPath } from "url"
import { join, dirname } from "path"

const { readJSON, writeJSON, writeFile } = fs

//process.cwd() return the folder of this project

// fs.ensureDirSync to be sure to create the path/folder

const experiencesFolderPath = join(process.cwd(), "../../public/imageFolder/experience")

const profileAvatarFolderPath = join(process.cwd(), "./public/profile/avatar")
fs.ensureDirSync(profileAvatarFolderPath) // it partially works, first time crashes the app, but creates the PATH

console.log(experiencesFolderPath)

//save the picture in the public folder
export const saveExperiencesImage = (fileName, contentAsBuffer) => {
  writeFile(join(experiencesFolderPath, fileName), contentAsBuffer)
}
//save the profile's avatar in the public folder
export const saveProfileAvatar = (fileName, contentAsBuffer) => {
  writeFile(join(profileAvatarFolderPath, fileName), contentAsBuffer)
}
