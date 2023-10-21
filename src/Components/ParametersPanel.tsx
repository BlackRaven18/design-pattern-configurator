import { Box, Button, Divider, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewFile, changeSelectedPatternCurrentFileName, setIsEditorReadOnly } from "../redux/AppStateSlice";
import { AppDispatch, RootState } from "../redux/store";
import MethodBodyGenerator from "../utils/MethodBodyGenerator";

interface ParametersPanelProps {
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

const ParametersPanel: React.FC<ParametersPanelProps> = ({ editorRef }) => {

    const dispatch = useDispatch<AppDispatch>();

    const selectedPattern = useSelector((state: RootState) => state.appState.selectedPattern);
    const selectedFile = useSelector((state: RootState) => state.appState.selectedFile);
    const isEditorReadOnly = useSelector((state: RootState) => state.appState.isEditorReadOnly);
    const selectedTabIndex = useSelector((state: RootState) => state.appState.selectedTabIndex);

    const [paramFieldsValueArray, setParamFieldsValueArray] = useState<string[]>(
        selectedPattern.params.map(param => param.defaultValue || '')
    );

    const [isSelectedFileChanged, setIsSelectedFileChanged] = useState(false);
    const [isParamsFieldsDisabled, setIsParamsFieldsDisabled] = useState(false);

    const methodBodyGenerator = new MethodBodyGenerator();

    useEffect(() => {
        setIsSelectedFileChanged(true);
    }, [selectedFile])


    useEffect(() => {

        if (isSelectedFileChanged) {
            replaceEditorContentWithParamsValues();
        }

    }, [isSelectedFileChanged, paramFieldsValueArray])

    useEffect(() => {

        updateParamFieldsValueArrayWhenPatternIsChanged();

    }, [selectedPattern])


    const replaceEditorContentWithParamsValues = () => {
        setEditorValueToValueWithReplacedVariables(paramFieldsValueArray);

        setIsSelectedFileChanged(false);
    }

    const updateParamFieldsValueArrayWhenPatternIsChanged = () => {
        let paramFieldsValueArrayCopy = [
            ...selectedPattern.params.map(param => param.defaultValue || '')
        ];

        setParamFieldsValueArray(paramFieldsValueArrayCopy);
    }

    const setEditorValueToValueWithReplacedVariables = (params: string[]) => {
        let editorValueWithReplacedVariables = replaceVariablesWithParamsValues(selectedFile.content, params);
        editorRef.current?.setValue(editorValueWithReplacedVariables);
    }

    const replaceVariablesWithParamsValues = (editorDefalutValue: string, params: string[]) => {

        selectedPattern.params.forEach((param, index) => {
            if (param.defaultValue.includes("$")) {
                selectedPattern.params.forEach((paramToCheck, paramToCheckIndex) => {
                    if (paramToCheck.replace === param.defaultValue) {
                        let methodsWithBodyAsString = methodBodyGenerator.getMethodsWithBodyAsString(params[paramToCheckIndex])
                        editorDefalutValue = editorDefalutValue.replaceAll(param.replace, methodsWithBodyAsString)

                    }
                })
            } else {
                //TODO: improve this later
                let paramValueToBeReplaced = params[index] ?? "*NO VALUE DELIVERED*";

                if (paramValueToBeReplaced.includes("\n")) {
                    paramValueToBeReplaced = paramValueToBeReplaced.replaceAll("\n", "\n\t");
                    console.log(paramValueToBeReplaced);
                }

                editorDefalutValue = editorDefalutValue.replaceAll(param.replace, paramValueToBeReplaced);
            }
        })


        return editorDefalutValue;
    }



    const handleFileNameChange = (newValue: string, fileIndex: number) => {
        dispatch(changeSelectedPatternCurrentFileName({
            currentName: newValue,
            fileIndex: fileIndex,
        }))
    }

    const handleParameterChange = (newValue: string, textFieldIndex: number) => {

        const paramFieldsValueArrayCopy = [...paramFieldsValueArray];
        paramFieldsValueArrayCopy[textFieldIndex] = newValue;

        setParamFieldsValueArray(paramFieldsValueArrayCopy);
        setEditorValueToValueWithReplacedVariables(paramFieldsValueArrayCopy);
    }

    const handleEditorReadOnlyChange = () => {
        dispatch(setIsEditorReadOnly(!isEditorReadOnly));
        setIsParamsFieldsDisabled(!isParamsFieldsDisabled);
    }



    return (
        <Box
            height='100%'
            sx={{
                backgroundColor: "secondary.main",
                padding: "10px",
            }}
        >


            <Stack
                paddingTop='10px'
                spacing="20px"
            >
                <TextField
                    label={"File name"}
                    variant="outlined"
                    value={selectedPattern.files[selectedTabIndex].currentName || ""}
                    onChange={e => handleFileNameChange(e.target.value, selectedTabIndex)}
                />
                <Divider />

                {selectedPattern.params.map((param, index) => {
                    let multiline = param.defaultValue.includes("\n");
                    if (param.shouldBeVisible) {
                        return (
                            <TextField
                                key={index}
                                label={param.label}
                                variant="outlined"
                                multiline={multiline}
                                value={paramFieldsValueArray[index] || ""}
                                onChange={e => handleParameterChange(e.target.value, index)}
                                disabled={isParamsFieldsDisabled}
                            />
                        );
                    } else {
                        return (<></>)
                    }
                })}

                <Button
                    onClick={() => {
                        alert(editorRef.current?.getValue());
                    }}
                >show editor value
                </Button>
                <Button

                    onClick={() => {
                        dispatch(addNewFile({
                            defaultName: "Builder.java",
                            currentName: "Builder.java",
                        }));
                    }}
                >Add new file
                </Button>

                <FormControlLabel
                    control={
                        <Switch
                            checked={isEditorReadOnly}
                            onChange={handleEditorReadOnlyChange}
                        />
                    }
                    label="Read only mode" />

            </Stack>
        </Box>
    );
}

export default ParametersPanel;