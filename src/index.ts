#!/usr/bin/env node
import fs from "fs";
import inquirer from "inquirer";

interface Permission {
  choice: boolean;
}

interface Answer {
  choices: string[];
}

function fetchDirectory(): string[] {
  const files: string[] = fs.readdirSync("./", "utf-8");
  return files;
}

async function writeGitIgnore(files: string[]): Promise<void> {
  const answer: Answer = await inquirer.prompt({
    type: "checkbox",
    name: "choices",
    message:
      "✅ Select the files in your current directory that you would like git to ignore.",
    choices: files,
  });

  const choices: string[] = answer.choices;

  const data: string = choices.join("\n");
  fs.writeFileSync(".gitignore", data);
  console.log("🎉 Successfully created the .gitignore file.");
  process.exit(0);
}

async function gitIgnore(): Promise<void> {
  const files: string[] = fetchDirectory();
  if (fs.existsSync(".gitignore")) {
    const permission: Permission = await inquirer.prompt({
      type: "confirm",
      name: "choice",
      message: "Do you want to overwrite your current .gitignore file?",
      default: true,
    });

    if (!permission.choice) {
      console.log("❌ Exiting...");
      process.exit(0);
    }

    fs.unlinkSync(".gitignore");
    console.log("🔨 Creating new .gitignore file...");
  }

  writeGitIgnore(files);
}

function main() {
  console.clear();
  gitIgnore();
}

main();
