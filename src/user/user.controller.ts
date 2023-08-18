import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'helpers/config'
import { filterImageConfig } from 'helpers/upload-file-config'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private cloudinaryService: CloudinaryService
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllUser(@Query() query: FilterUserDto) {
    return {
      success: true,
      result: await this.userService.getAllUser(query)
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    if (req.user_data.id !== id) {
      throw new BadRequestException('You do not have permission!')
    }

    return {
      success: true,
      result: await this.userService.getUser(id)
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      result: await this.userService.create(createUserDto)
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    console.log(req.user_data.id)
    if (req.user_data.id !== id) {
      throw new BadRequestException('You do not have permission!')
    }
    return {
      success: true,
      result: await this.userService.update(id, updateUserDto)
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    if (req.user_data.status !== 1) {
      throw new BadRequestException('You do not have permission!')
    }
    return {
      success: true,
      result: await this.userService.delete(id)
    }
  }

  @Post('upload-avt')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatars'),
      fileFilter: filterImageConfig()
    })
  )
  async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }

    if (!file) {
      throw new BadRequestException('File is required')
    }

    const cloudFile = await this.cloudinaryService.uploadFile(file, 'image-avt')

    return {
      success: true,
      result: await this.userService.updateAvatar(req.user_data.id, cloudFile.url)
    }
  }
}
