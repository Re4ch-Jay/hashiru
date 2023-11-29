const { execSync } = require('child_process');
const { input, confirm, select, Separator } = require('@inquirer/prompts');
const { program } = require('commander');
const generateExpressProject = require('./template/index');

program
  .version('1.0.0') // Set the version of your CLI tool
  .description('A CLI Starter Kit For Express.js');

program
  .command('create-express-app')
  .description('Starter Kit For Express.js')
  .action(() => {
    createExpressProject();
  });

// Parse command-line arguments
program.parse(process.argv);

async function createExpressProject() {
  const projectName = await input({ message: "What's your project name?" });
  const typeScriptSupport = await confirm({ message: 'Do you want to use TypeScript?' });

  const ormSupport = await select({
    message: 'Select an ORM',
    choices: [
      { name: 'mongoose', value: 'mongoose' },
      { name: 'sequelize', value: 'sequelize' },
      { name: 'typeorm', value: 'typeorm' },
      { name: 'knex', value: 'knex' },
      { name: 'bookshelf', value: 'bookshelf' },
      { name: 'objection', value: 'objection' },
      { name: 'no', value: 'no' },
      new Separator(),
    ],
  });
  const templateEngineSupport = await select({
    message: 'Select a Template Engine',
    choices: [
      { name: 'ejs', value: 'ejs' },
      { name: 'pug', value: 'pug' },
      { name: 'no', value: 'no' },
      new Separator(),
    ],
  });

  console.log('\nCreating Express project...');

  generateExpressProject(projectName, typeScriptSupport);

  // Change the current working directory to the project directory
  process.chdir(projectName);

  // Run npm install for base dependencies
  console.log('\nInstalling base dependencies...');
  execSync('npm install express morgan', { stdio: 'inherit' });
  execSync('npm install nodemon --save', { stdio: 'inherit' });

  // Install ORM
  if(ormSupport !== 'no') {
    console.log(`\nInstalling ${ormSupport}...`);
    execSync(`npm install ${ormSupport}`, { stdio: 'inherit' });
    if(ormSupport === 'typeorm') {
      execSync(`npm install reflect-metadata --save`, { stdio: 'inherit' });
    }
  }
  
  // Install the selected template engine(s)
  if(templateEngineSupport !== 'no') {
    console.log(`\nInstalling ${templateEngineSupport} template engine...`);
    execSync(`npm install ${templateEngineSupport}`, { stdio: 'inherit' });  
  }
  
  console.log(`Express application structure has been created.\ncd ${projectName}\nnpm start or npm run dev\n`);
}

