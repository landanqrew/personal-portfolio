

export async function readJsonFile(path: string) {
    try {
        const file = Bun.file(path);
        const text = await file.text();
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Error reading from file ${path}: ${e}`);
    }
}

export async function writeJsonFile(path: string, data: any) {
    try {
        const file = Bun.file(path);
        await file.write(JSON.stringify(data, null, 2));
    } catch (e) {
        throw new Error(`Error writing to file ${path}: ${e}`);
    }
}

export async function deleteFile(path: string) {
    try {
        const file = Bun.file(path);
        await file.delete();
    } catch (e) {
        throw new Error(`Error deleting file ${path}: ${e}`);
    }
}