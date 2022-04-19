import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdf from 'html-pdf';
import * as ejs from 'ejs';

@Injectable()
export class PdfService {
  async generatePdf(
    nameSurname: string,
    totalScore: number
  ): Promise<fs.ReadStream> {
    const data = await ejs.renderFile(__dirname + '/../../utils/pdfForm.ejs', {
      nameSurname: nameSurname,
      totalScore: totalScore
    });
    return new Promise((resolve) => {
      const options = {
        width: '860px',
        height: '640px'
      };
      pdf.create(data, options).toStream(function (err, stream) {
        if (err) {
          throw ('PDF generation error');
        } else {
          resolve(stream);
        }
      });
    });
  }
}
