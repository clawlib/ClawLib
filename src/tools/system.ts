import { z } from 'zod';
import { createTool } from '../tools';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const getSystemInfo = createTool({
    id: 'get_system_info',
    description: 'Get OS and hardware information (Platform, CPU, Memory)',
    parameters: z.object({}),
    execute: async () => {
        return {
            platform: os.platform(),
            release: os.release(),
            arch: os.arch(),
            cpus: os.cpus().length,
            totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
            freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`
        };
    }
});

export const runCommand = createTool({
    id: 'run_shell_command',
    description: 'Run a shell command on the host machine (Windows/Linux/MacOS)',
    parameters: z.object({
        command: z.string().describe('The command to execute')
    }),
    execute: async ({ command }) => {
        // SECURITY NOTE: In a real app, this should require manual approval
        const { stdout, stderr } = await execAsync(command);
        return stdout || stderr;
    }
});
