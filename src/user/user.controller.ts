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
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DeleteResult, UpdateResult } from 'typeorm'
import { FilterUserDto } from './dto/filter-user.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'helpers/config'
import { filterConfig } from 'helpers/upload-file-config'

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllUser(@Query() query: FilterUserDto): Promise<any> {
    return this.userService.getAllUser(query)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUser(@Request() req: any, @Param('id', ParseIntPipe) id: number): Promise<User> {
    if (req.user_data.id !== id) {
      throw new BadRequestException('You do not have permission!')
    }
    return this.userService.getUser(id)
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UpdateResult> {
    console.log(req.user_data.id)
    if (req.user_data.id !== id) {
      throw new BadRequestException('You do not have permission!')
    }
    return this.userService.update(id, updateUserDto)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.userService.delete(id)
  }

  @Post('upload-avt')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatars'),
      fileFilter: filterConfig()
    })
  )
  uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }

    if (!file) {
      throw new BadRequestException('File is required')
    }
    return this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename)
  }
}
