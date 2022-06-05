import Mongoose from "mongoose";

const { Schema } = Mongoose;

const trailSchema = new Schema({
  title: String,
  county: String,
  latt: Number,
  long: Number,
  traillistid: {
    type: Schema.Types.ObjectId,
    ref: "Traillist",
  },
});

export const Trail = Mongoose.model("Trail", trailSchema);