import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutual } from './interfaces/mutual.interface';
import { CreateMutualDto } from './dto/create-mutual.dto';
import { Model } from 'mongoose';

@Injectable()
export class MutualesService {
    constructor(@InjectModel('Mutual') private mutualModel: Model<Mutual>) { }

    async getMutuales(): Promise<Mutual[]> {
        return this.mutualModel.find();
    }

    async getMutual(id: string): Promise<Mutual> {
        const mutual = await this.mutualModel.findById(id);
        if (!mutual) throw new NotFoundException(`Mutual not Found`);
        return mutual;
    };

    async createMutual(createMututalDto: CreateMutualDto): Promise<Mutual> {
        return await this.mutualModel.create({ ...createMututalDto });
    }

    async updateMutual(id: string, createMutualDto: CreateMutualDto): Promise<Mutual> {
        await this.getMutual(id);
        return await this.mutualModel.findByIdAndUpdate(id, { ...createMutualDto }, { new: true });
    };

    async deleteMutual(id: string): Promise<void> {
        await this.mutualModel.findByIdAndDelete(id);
    }

}
