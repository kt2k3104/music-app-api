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
  UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'helpers/config'
import { filterImageConfig } from 'helpers/upload-file-config'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { Role } from 'src/auth/decorator/role.decorator'

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private cloudinaryService: CloudinaryService
  ) {}

  @Role('admin')
  @Get()
  async getAllUser(@Query() query: FilterUserDto) {
    return {
      success: true,
      result: await this.userService.getAllUser(query)
    }
  }

  @Get(':id')
  async getUser(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    if (req.user.id !== id) {
      throw new BadRequestException('You do not have permission!')
    }

    return {
      success: true,
      result: await this.userService.getUser(id)
    }
  }

  @Role('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      result: await this.userService.create(createUserDto)
    }
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (req.user.id !== id) {
      throw new BadRequestException('You do not have permission!')
    }
    return {
      success: true,
      result: await this.userService.update(id, updateUserDto)
    }
  }

  @Role('admin')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      result: await this.userService.delete(id)
    }
  }

  @Post('upload-avt')
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
      result: await this.userService.updateAvatar(req.user.id, cloudFile.url)
    }
  }
}
