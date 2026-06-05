import mongoose, { Document, Schema } from "mongoose";

export interface IToolsIcon extends Document {
    label: string;
    icon: string;
    status: "active" | "inactive";
    value: number;
    order: number;
}

const ToolsIconSchema = new Schema<IToolsIcon>({
    label: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        unique: true,
    },
    order: {
        type: Number,
        unique: true,
        sparse: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, {
    timestamps: true,
});

const ToolsIcon = mongoose.model<IToolsIcon>('ToolsIcon', ToolsIconSchema);
export default ToolsIcon;