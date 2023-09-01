import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomExceptionFilter } from 'src/filters/expection.filter';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';

@Controller('user')
@UseFilters(new CustomExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  Register_A_User(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  getUserDetail(@Request() req, @Param('id') id: string) {
    if (req.user.id != id) {
      throw new HttpException(
        "You're not allow to view data, becouse you're not owner.",
        400,
      );
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.id != id) {
      throw new HttpException(
        "You're not allow to update data, becouse you're not owner.",
        400,
      );
    }
    return this.userService.update(+id, updateUserDto);
  }
}
