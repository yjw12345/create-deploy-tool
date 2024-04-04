import execa from 'execa'
import { $ } from 'zx'
const projectRoot = process.cwd()

execa.commandSync("git add .", {
    stdio: "inherit",
    cwd: projectRoot,
});
setTimeout(() => {
    execa.commandSync(`git commit -m 'auto commit'`, {
        stdio: "inherit",
        cwd: projectRoot,
    });
}, 3000);
setTimeout(() => {
    execa.commandSync(`git push`, {
        stdio: "inherit",
        cwd: projectRoot,
    });
}, 6000);