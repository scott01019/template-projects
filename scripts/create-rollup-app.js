import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import isValidPath from 'is-valid-path';

const errors = {
    'NO_PROJECT_DIRECTORY': {
        log: () => {
            console.debug(`Please provide a directory for the project:`);
            console.debug(`\t${chalk.blue('create-rollup-app')} ${chalk.green('<project-directory>')}`, '\n');
            console.debug(`For Examples:`);
            console.debug(`\t${chalk.blue('create-rollup-app')} ${chalk.green('my-project')}`, '\n');
        }
    },
    'INVALID_PROJECT_DIRECTORY': {
        log: () => {
            console.debug(`${chalk.red(process.argv[2])} is not a valid project directory.`, '\n');
            errors['NO_PROJECT_DIRECTORY'].log();
        }
    },
    'DIRECTORY_ALREADY_EXISTS': {
        log: () => {
            console.debug(`Directory ${chalk.red(process.argv[2])} already exists!`, '\n');
            console.debug(`Please provide a new directory for the project.`, '\n');
        }
    }
};

try {
    if (process.argv.length < 3) {
        throw new Error('NO_PROJECT_DIRECTORY');
    }

    if (!isValidPath(process.argv[2])) {
        throw new Error('INVALID_PROJECT_DIRECTORY');
    }

    if (fs.existsSync(process.argv[2])) {
        throw new Error('DIRECTORY_ALREADY_EXISTS');
    }

    fs.mkdirSync(process.argv[2], { recursive: true });
    fs.mkdirSync(`${process.argv[2]}/public`);
    fs.mkdirSync(`${process.argv[2]}/src`);
    fs.copyFileSync('./rollup-app-template/public/index.html', `${process.argv[2]}/public/index.html`);
    fs.copyFileSync('./rollup-app-template/src/main.js', `${process.argv[2]}/src/main.js`);
    fs.copyFileSync('./rollup-app-template/package.json', `${process.argv[2]}/package.json`);
    fs.copyFileSync('./rollup-app-template/rollup.config.js', `${process.argv[2]}/rollup.config.js`);
} catch (err) {
    if (errors[err.message]) {
        errors[err.message].log();
    } else {
        console.log(err);
    }
}
