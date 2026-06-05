import ToolsIcon, { IToolsIcon } from '../models/toolsIcon.model';

export class ToolsIconService {
    static async create(data: any): Promise<IToolsIcon> {
        const lastTool = await ToolsIcon.findOne({}, 'value').sort({ value: -1 });

        let nextValue = 1;
        if (lastTool && typeof lastTool.value === 'number') {
            nextValue = lastTool.value + 1;
        }


        data.value = nextValue;

        const newIcon = new ToolsIcon(data);
        return await newIcon.save();
    }

    static async getAll(): Promise<IToolsIcon[]> {
        return await ToolsIcon.find().sort({ order: 1 });
    }

    static async getById(id: string): Promise<IToolsIcon | null> {
        return await ToolsIcon.findById(id);
    }

    static async update(id: string, data: any): Promise<IToolsIcon | null> {
        return await ToolsIcon.findByIdAndUpdate(id, data, { new: true, runValidators: true, });
    }

    static async delete(id: string): Promise<IToolsIcon | null> {
        return await ToolsIcon.findByIdAndDelete(id);
    }
}
