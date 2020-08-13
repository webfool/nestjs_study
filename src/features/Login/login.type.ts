import { IsString, IsNumber } from "class-validator";

export class Item {
  @IsString()
  name: string

  @IsNumber()
  age: number

  from: string
}