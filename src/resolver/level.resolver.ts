import { Resolver, Arg, Query } from "type-graphql";
import { Level } from "../schema/level.schema.js";
import LevelService from "../service/level.service.js";
import { GetLevelInput } from "../types/inputs/level.input.js";

@Resolver(Level)
class LevelResolver {
  constructor(private levelService: LevelService) {
    this.levelService = new LevelService();
  }

  // QUERIES ------------------------------------------------------------

  @Query(() => [Level])
  levels() {
    return this.levelService.findAll();
  }

  @Query(() => Level, { nullable: true })
  level(@Arg("input") input: GetLevelInput) {
    return this.levelService.findByLevel(input);
  }
}

export default LevelResolver;
