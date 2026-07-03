import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const [users, savingsAgg] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      }),
      this.prisma.saving.groupBy({
        by: ['userId'],
        _sum: { amount: true },
      }),
    ]);

    const savingsMap = new Map(
      savingsAgg.map((s) => [s.userId, Number(s._sum.amount || 0)]),
    );

    return users.map((user) => ({
      ...user,
      total_amount: savingsMap.get(user.id) || 0,
    }));
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
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const savings = await this.prisma.saving.findMany({
      where: { userId: id },
      select: { amount: true, date: true },
    });

    let total_amount = 0;
    const yearly_breakdown: Record<string, number> = {};
    const monthly_breakdown: Record<string, number> = {};

    for (const saving of savings) {
      const amount = Number(saving.amount);
      total_amount += amount;

      const date = new Date(saving.date);
      const year = date.getFullYear().toString();
      const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      yearly_breakdown[year] = (yearly_breakdown[year] || 0) + amount;
      monthly_breakdown[month] = (monthly_breakdown[month] || 0) + amount;
    }

    return {
      ...user,
      total_amount,
      yearly_breakdown,
      monthly_breakdown,
    };
  }
}
