import fs from "fs";

const filePath = process.argv[2];
const shebang = "#!/usr/bin/env bun\n";

async function prependShebang() {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    if (data.startsWith(shebang)) {
      console.log("Shebang already exists. Skipping insertion.");
      return;
    }
    await fs.promises.writeFile(filePath, shebang + "\n" + data, "utf-8");
    console.log("Shebang added successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

prependShebang();
