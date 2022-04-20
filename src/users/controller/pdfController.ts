import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  Response,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '../../middlewares/checkJwt';
import { PdfService } from '../service/pdfService';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('pdf')
export class PdfController {
  @Inject()
  pdfService: PdfService;

  @UseInterceptors(ClassSerializerInterceptor)
 // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async generatePdf(
    @Body() body: { nameSurname: string; totalScore: number },
    @Response() res
  ) {
    try {
      const stream = await this.pdfService.generatePdf(
        body.nameSurname,
        body.totalScore
      );

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename="${body.nameSurname}.pdf"`
      });
      stream.pipe(res);
    } catch (err) {
      throw {
        statusCode: 400,
        message: 'Cannot open the PDF. The file may be corrupt, or in an unsupported format.'
      };

    }
  }
}
