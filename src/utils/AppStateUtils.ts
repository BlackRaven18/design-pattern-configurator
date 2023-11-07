import { PatternFamillyInfo, PatternInfo, PatternConfigInfo, TextFieldParamData, Config, MethodGeneratorConfig } from "../types";
import CodeParamsReplacer from "./CodeParamsReplacer";
import FileReader from "./FileReader";

export default class AppStateUtils {

    private fileReader = new FileReader();
    private codeParamsReplacer = new CodeParamsReplacer();

    public async getConfig(path: string): Promise<Config> {

        const fileConfigAsString = await this.fileReader.handleFileRead(path);

        return JSON.parse(fileConfigAsString);

    }

    public async getMethodGeneratorConfig(path: string): Promise<MethodGeneratorConfig> {

        const configAsString = await this.fileReader.handleFileRead(path);

        return JSON.parse(configAsString);

    }

    public async getPatternConfigFile(patternFamillyInfo: PatternFamillyInfo, patternInfo: PatternInfo) {
        let patternConfigFilePath = patternFamillyInfo.patternsDir + "/" + patternInfo.patternDir + "/" + patternInfo.configFile;
        const patternConfigFile = await this.fileReader.handleFileRead(patternConfigFilePath);
        const patternConfigFileJSON: PatternConfigInfo = JSON.parse(patternConfigFile);

        return patternConfigFileJSON;
    }

    public async getPatternFilesContent(
        patternConfigFile: PatternConfigInfo,
        patternFamillyInfo: PatternFamillyInfo,
        patternInfo: PatternInfo
    ) {
        let patternFilePaths: string[] = [...patternConfigFile.files.map(file => {
            let path = patternFamillyInfo.patternsDir + "/"
                + patternInfo.patternDir + "/"
                + file.defaultName;

            return path;
        })]

        const patternFilesContent = await this.fileReader.readMultipleFiles(patternFilePaths);

        return patternFilesContent;
    }

    public getPatternFilesContentWithReplacedParams(
        methodGeneratorConfig: MethodGeneratorConfig,
        patternFilesContent: string[],
        params: TextFieldParamData[]
    ) {
        let replaceData = params.map(param => {
            return {
                replace: param.replace,
                value: param.defaultValue
            }
        })

        let patternFilesContentWithReplacedParams: string[] = [];

        patternFilesContent.forEach((fileContent) => {
            //let filteredReplaceData = replaceData.filter(data => data.fileName === undefined || data.fileName === file.defaultName);

            patternFilesContentWithReplacedParams.push(
                this.codeParamsReplacer.getReplacedContent(methodGeneratorConfig, fileContent, replaceData)
            );
        })

        return patternFilesContentWithReplacedParams;
    }
}