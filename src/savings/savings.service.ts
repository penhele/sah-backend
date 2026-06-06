import { Injectable } from '@nestjs/common';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSavingDto) {
    return this.prisma.saving.create({
      data: {
        amount: dto.amount,
        userId: dto.userId,
        updated_at: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.saving.findMany({
      include: {
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.saving.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, dto: UpdateSavingDto) {
    return this.prisma.saving.update({
      data: {
        amount: dto.amount,
        userId: dto.userId,
        updated_at: new Date(),
      },
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.saving.delete({
      where: {
        id,
      },
    });
  }
}
