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
import { CreatePdfDto } from '../dto/pdfDto';
import { RolesGuard } from '../../middlewares/checkAdmin';

@Controller('pdf')
export class PdfController {
  @Inject()
  pdfService: PdfService;

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async generatePdf(@Body() createPdfDto: CreatePdfDto, @Response() res) {
    try {
      const stream = await this.pdfService.generatePdf(createPdfDto);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename="${createPdfDto.firstName} ${createPdfDto.lastName}.pdf"`
      });
      stream.pipe(res);
    } catch (err) {
      throw {
        statusCode: 400,
        message:
          'A portion of the request made to the API request was not valid or could not be processed in the current context.'
      };
    }
  }
}
