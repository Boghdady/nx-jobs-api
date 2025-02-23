// Other entities will extend from this model
import { Field, ID, ObjectType } from '@nestjs/graphql';

/*
 isAbstract: true means that this class will not be mapped to a database table but will be used
 as a base class for other entities.
 () => ID is a function that returns the ID type. This is necessary because the ID type is a unique identifier
 */
@ObjectType({ isAbstract: true })
export abstract class AbstractModel {
  @Field(() => ID)
  id: number;
}
