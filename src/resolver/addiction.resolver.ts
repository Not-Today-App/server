import { Resolver, Arg, Query } from "type-graphql";

import { Addiction } from "../schema/addiction.schema.js";
import AddictionService from "../service/addiction.service.js";
import { GetAddictionInput } from "../types/inputs/addiction.input.js";

@Resolver(Addiction)
class AddictionResolver {
  constructor(private addictionService: AddictionService) {
    this.addictionService = new AddictionService();
  }

  // QUERIES ------------------------------------------------------------

  @Query(() => [Addiction])
  addictions() {
    return this.addictionService.findAll();
  }

  @Query(() => Addiction, { nullable: true })
  addiction(@Arg("input") input: GetAddictionInput) {
    return this.addictionService.findByName(input);
  }
}

export default AddictionResolver;
