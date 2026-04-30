import prisma from "./src/lib/prisma";

async function test() {
  try {
    const data = await prisma.finance.findMany();
    console.log("Finance data:", data);
  } catch (err) {
    console.error("Finance error:", err);
  } finally {
    process.exit(0);
  }
}

test();
