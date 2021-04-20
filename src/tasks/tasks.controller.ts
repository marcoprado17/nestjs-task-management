import { Body, Delete, Logger, Param, ParseIntPipe, Patch, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    
    constructor(private tasksService: TasksService) {}

    @Get()
    async getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto, null, 2)}`);
        return await this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
        return await this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating new task. Data: ${JSON.stringify(createTaskDto, null, 2)}`);
        return await  this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    async deleteTask(@GetUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    async updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User) : Promise<Task>{
        return await this.tasksService.updateTaskStatus(id, status, user);
    }
}
