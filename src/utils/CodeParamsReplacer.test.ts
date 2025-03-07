import CodeParamsReplacer from "./CodeParamsReplacer";
import {MethodGeneratorConfig, ReplaceData} from "../types";

describe('CodeParamsReplacer', () => {


    let codeParamsReplacer = new CodeParamsReplacer();
    let methodGeneratorConfig: MethodGeneratorConfig = {
        generatePatterns: []
    }

    it('should return code with replaced param', () => {

        let codeWithParams = "$MOCK_PARAM$";
        let replaceData: ReplaceData[] = [
            {
                replace: "$MOCK_PARAM$",
                value: "replaced mock param\nvalue"
            },
            {
                replace: "$MOCK_PARAM_OTHER$",
                value: "$MOCK_PARAM$"
            }
        ]

        let codeWithReplacedParams = codeParamsReplacer.getReplacedContent(
            methodGeneratorConfig,
            "",
            codeWithParams,
            replaceData
        )

        expect(codeWithReplacedParams).toEqual("replaced mock param\n\tvalue");
    })

})