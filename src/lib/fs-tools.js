import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

//process.cwd() return the folder of this project

// const experiencesFolderPath = join(
//   process.cwd(),
//   "../../public/imageFolder/experience"
// );

// console.log(experiencesFolderPath);

// //save the picture in the public folder
// export const saveExperiencesImage = (fileName, contentAsBuffer) => {
//   writeFile(join(experiencesFolderPath, fileName), contentAsBuffer);
// };
