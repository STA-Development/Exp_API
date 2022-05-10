import {Injectable} from '@nestjs/common'
import * as fs from 'fs'
import * as pdf from 'html-pdf'
import * as ejs from 'ejs'
import {CreatePdfDto} from '../dto/pdfDto'

@Injectable()
export class PdfService {
  async generatePdf(createPdfDto: CreatePdfDto): Promise<fs.ReadStream> {
    const data = await ejs.renderFile(`${__dirname}/../directory/pdfForm.ejs`, {
      ...createPdfDto,
    })
    return new Promise((resolve, reject) => {
      const options = {
        width: '860px',
        height: '640px',
      }
      pdf.create(data, options).toStream((err, stream) => {
        if (err) {
          reject(err)
        } else {
          resolve(stream)
        }
      })
    })
  }
}
