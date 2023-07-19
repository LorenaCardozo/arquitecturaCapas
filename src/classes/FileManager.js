import fs from 'fs'

/********  CLASS -- FILE MANAGER ***************/

export class FileManager {

    static async readFile(path) {
        try {
            if (fs.existsSync(path)) {
                let result = await fs.promises.readFile(path, "utf-8");

                let datos = result?await JSON.parse(result):[];
                return datos;
            }
        } catch (err) {
            console.log(err);
        }

    }

    static async writeFile(path, datos) {
        try {
            await fs.promises.writeFile(path, JSON.stringify(datos));
            return true;
        } catch (err) {
            console.log(err);
        }

    }

}

export default {
    FileManager
};