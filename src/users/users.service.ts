import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        savings: {
          select: {
            amount: true,
          },
        },
      },
    });

    return users.map((user) => {
      const total_amount = user.savings.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );
      const { savings, ...rest } = user;
      return { ...rest, total_amount };
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        savings: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const total_amount = user.savings.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );
    const { savings, ...rest } = user;

    return { ...rest, total_amount };
  }
}
