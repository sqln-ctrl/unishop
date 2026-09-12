import bcrypt from "bcryptjs";
import { adminPasswordField, emailField, textField } from "./validation.js";

export async function bootstrapAdmin(prisma, environment = process.env) {
  // Never restore bootstrap credentials after they have changed in the dashboard.
  if (await prisma.user.count({ where: { isAdmin: true } })) return "An admin already exists; credentials were preserved.";
  if (!environment.ADMIN_EMAIL && !environment.ADMIN_PASSWORD) return "Admin setup skipped: set ADMIN_EMAIL and ADMIN_PASSWORD to enable it.";
  const email = emailField(environment.ADMIN_EMAIL);
  const password = await bcrypt.hash(adminPasswordField(environment.ADMIN_PASSWORD), 12);
  const name = textField(environment.ADMIN_NAME || "UniShop Admin", "Admin name");
  return prisma.$transaction(async (tx) => {
    if (await tx.user.count({ where: { isAdmin: true } })) return "An admin already exists; credentials were preserved.";
    if (await tx.user.findUnique({ where: { email } })) {
      throw new Error("ADMIN_EMAIL belongs to an existing non-admin user. Choose an unused email; setup will not promote an existing account.");
    }
    await tx.user.create({
      data: { name, email, password, university: "UniShop Administration", isAdmin: true, isVerified: true },
    });
    return "Default admin created. Log in using ADMIN_EMAIL and ADMIN_PASSWORD from client/.env.";
  }, { isolationLevel: "Serializable", timeout: 15000 });
}
