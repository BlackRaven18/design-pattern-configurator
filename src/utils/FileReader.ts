import { } from "../redux/AppStateSlice";
// import fs from 'fs'
// import path from 'path'


export default class FileReader {


    async handleFileRead(path: string): Promise<string> {

        let content = "";
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error('Can not fetch a file');
            }

            content = await response.text();

            if (content.includes("<!DOCTYPE html>")) {
                content = "//No files found...";
                throw new Error("File is missing!");
            }

        } catch (error) {
            console.error('Could not read a file:', error);
        } finally {
            return content;
        }
    }
    async readMultipleFiles(filePaths: string[]): Promise<string[]> {
        const fileContents: string[] = [];

        for (const filePath of filePaths) {
            // try {
                const content = await this.handleFileRead(filePath);
                fileContents.push(content);
            // } catch (error) {
            //     console.error(`File read error: ${filePath}: ${error}`);
            //     fileContents.push("");
            // }
        }

        return fileContents;
    }

}
