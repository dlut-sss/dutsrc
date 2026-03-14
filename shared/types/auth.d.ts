import { users } from "@nuxthub/db/schema";

declare module "#auth-utils" {
  interface User {
    role: (typeof users.role.enumValues)[number];
  }
}

export {};
