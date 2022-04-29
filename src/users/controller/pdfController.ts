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
import { CreatePdtDto } from '../dto/pdfDto';

@Controller('pdf')
export class PdfController {
  @Inject()
  pdfService: PdfService;

  @UseInterceptors(ClassSerializerInterceptor)
  //@UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async generatePdf(
    @Body() createPdtDto:CreatePdtDto,
    @Response() res
  ) {
    try {
      const stream = await this.pdfService.generatePdf(
        createPdtDto
      );

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename="${createPdtDto.firstName+" "+createPdtDto.lastName}.pdf"`
      });
      stream.pipe(res);
    } catch (err) {
      throw {
        statusCode: 400,
        message: 'A portion of the request made to the API request was not valid or could not be processed in the current context.'
      };
    }
  }
}
