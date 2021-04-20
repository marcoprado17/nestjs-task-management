import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly alloweStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]
    
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is invalid status`);
        }

        return value;
    }

    private isStatusValid(statusCandidate: any): boolean {
        const idx = this.alloweStatuses.indexOf(statusCandidate);
        return idx !== -1;
    }
}