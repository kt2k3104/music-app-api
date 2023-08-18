import { diskStorage } from 'multer'
import { extname } from 'path'

export const storageConfig = (folder: string) =>
  diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

export const filterImageConfig =
  () => (req: any, file: MulterFile, cb: (error: Error, acceptFile: boolean) => void) => {
    const extension = extname(file.originalname)
    const allowdExtArr = ['.jpg', '.png', '.jpeg']
    if (!allowdExtArr.includes(extension)) {
      req.fileValidationError = 'wrong extension type. Accepted file ext are: jpg, png, jpeg'
      cb(null, false)
    } else {
      const fileSize = parseInt(req.headers['content-length'])
      if (fileSize > 1024 * 1024 * 5) {
        req.fileValidationError = 'file size is too large. Accepted file size is less than 5 MB'
        cb(null, false)
      } else {
        cb(null, true)
      }
    }
  }

export const filterAudioConfig =
  () => (req: any, file: MulterFile, cb: (error: Error, acceptFile: boolean) => void) => {
    const extension = extname(file.originalname)
    const allowdExtArr = ['.mp3']
    if (!allowdExtArr.includes(extension)) {
      req.fileValidationError = 'wrong extension type. Accepted file ext are:  mp3'
      cb(null, false)
    } else {
      const fileSize = parseInt(req.headers['content-length'])
      if (fileSize > 1024 * 1024 * 20) {
        req.fileValidationError = 'file size is too large. Accepted file size is less than 20 MB'
        cb(null, false)
      } else {
        cb(null, true)
      }
    }
  }

interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer: Buffer
}
