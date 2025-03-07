import { MethodGeneratePatternInfo, MethodGeneratorConfig, ReturnTypeInfo } from "../types";
export default class MethodBodyGenerator {

    public getMiddleWord(text: string, beginWord: string, endWord: string): string {
        const beginWordIndes = text.indexOf(beginWord);
        const endWordIndex = text.indexOf(endWord);

        if (beginWordIndes !== -1 && endWordIndex !== -1 && endWordIndex > beginWordIndes) {
            const fragment = text.substring(beginWordIndes + beginWord.length, endWordIndex);
            return fragment.trim();
        } else {
            return "";
        }
    }

    public generateMethod(
        methodGeneratorConfig: MethodGeneratorConfig,
        methodHeader: string,
        language: string
    ) {

        let methodGeneratorPattern: MethodGeneratePatternInfo = {
            language: "",
            defaultAccessType: "",
            accessTypes: [],
            returnTypes: [],
            bodyTemplate: "",

        }

        methodGeneratorConfig.generatePatterns.forEach(generatePattern => {
            if (generatePattern.language === language) {
                methodGeneratorPattern = generatePattern;
                return;
            }
        })


        let methodWithBody = "";

        let methodName = "";
        let methodParams = "";
        let accessType = methodGeneratorPattern.defaultAccessType;
        let returnTypeInfo: ReturnTypeInfo = {
            returnType: "",
            shouldReturn: ""
        }

        let methodHeaderWithNoParams = methodHeader.substring(0, methodHeader.indexOf("("));



        methodGeneratorPattern.accessTypes.forEach(supportedAccessType => {
            if (methodHeader.indexOf(supportedAccessType) !== -1) {
                accessType = supportedAccessType;
                return;
            }
        })


        //----------------------------

        methodGeneratorPattern.returnTypes.forEach(supportedReturnType => {
            if (methodHeaderWithNoParams.indexOf(supportedReturnType.returnType) !== -1) {
                returnTypeInfo = supportedReturnType;
                return;
            }
        })

        if (returnTypeInfo.returnType.length <= 0) {


            let accessTypeIndex = methodHeader.indexOf(accessType);

            if (accessTypeIndex === -1) {
                accessTypeIndex = 0;
            }
            else {
                accessTypeIndex += accessType.length + 1;
            }

            let stringWithAccessType = methodHeader.substring(accessTypeIndex);
            returnTypeInfo.returnType = stringWithAccessType.substring(0, stringWithAccessType.indexOf(" "));
            returnTypeInfo.shouldReturn = "return null;";

        }
        //----------------------------------------


        if (returnTypeInfo.returnType.length <= 0) {
            return "\t// unsupported parameters in method header: " + methodHeader;
        }

        if (returnTypeInfo.returnType.length > 0) {


            methodName = this.getMiddleWord(methodHeader, returnTypeInfo.returnType, "(")
            methodParams = this.getMiddleWord(methodHeader, "(", ")");
            let replaceData = [
                {
                    replace: "$ACCESS_TYPE$",
                    value: accessType
                },
                {
                    replace: "$RETURN_TYPE$",
                    value: returnTypeInfo.returnType
                },
                {
                    replace: "$RETURN_TYPE_VALUE$",
                    value: returnTypeInfo.shouldReturn
                },
                {
                    replace: "$NAME$",
                    value: methodName
                },
                {
                    replace: "$PARAMS$",
                    value: methodParams
                }
            ]

            methodWithBody = methodGeneratorPattern.bodyTemplate;

            replaceData.forEach(data => {
                methodWithBody = methodWithBody.replaceAll(data.replace, data.value);
            })



        }
        return methodWithBody;
    }

    public getMethodsHeaders = (methodsSignaturesSeparatedWithNewLineSign: string) => {

        let methodHeaders = methodsSignaturesSeparatedWithNewLineSign.split("\n");
        let trimedMethodHeadersWithNoSemicolons = methodHeaders.map(
            methodHeader => methodHeader.trim().replaceAll(";", "")
        );

        return trimedMethodHeadersWithNoSemicolons;
    }


}