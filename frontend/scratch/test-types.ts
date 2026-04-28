import { Prisma } from "@prisma/client";

type UserInclude = Prisma.UserInclude;
const include: UserInclude = {
  marketplacePurchases: true
};
console.log("Type check passed!");
