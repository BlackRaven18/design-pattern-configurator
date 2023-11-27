import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState, LoadedPatternFileInfo, PatternConfigInfo, TextFieldParamData} from "../types";
import AppStateUtils from "../utils/AppStateUtils";


const initialState: AppState = {
    appConfig: {
        defaultSelectedPatternFamillyIndex: 0,
        defaultSelectedPatternIndex: 0,
        defaultSelectedTabIndex: 0,
        patternFamillies: [
            {
                patternFamillyName: "",
                patternsDir: "",
                patterns: [
                    {
                        patternName: "",
                        patternDir: "",
                        configFile: ""
                    }
                ]
            }
        ]
    },

    methodGeneratorConfig: {
        generatePatterns: [],
    },

    selectedPatternFamillyIndex: 0,
    selectedPatternIndex: 0,
    selectedTabIndex: 0,
    isDrawerOpen: false,
    isEditorReadOnly: true,

    selectedPattern: {
        name: "",
        language: "",
        files: [
            {
                sourceFile: "",
                defaultName: "foo",
                currentName: "",
                extension: "",
                defaultContent: "",
                currentContent: ""

            }
        ],
        params: {
            textFieldParams: [{
                shouldBeVisible: true,
                label: "",
                defaultValue: "",
                currentValue: "",
                replace: "",
                filename: []
            }],
            selectParams: [
                {
                    label: "",
                    fileNameToBeMultiplied: "foo",
                    minNumber: 1,
                    maxNumber: 5
                }
            ]
        }
    }

}

export const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        removeFileFromPattern: (state, action: PayloadAction<{ filename: string }>) => {
            state.selectedPattern.files
                = state.selectedPattern.files.filter(file => file.sourceFile !== action.payload.filename)
        },

        //--------------
        removeTextFieldParamsConnectedToFile: (state, action: PayloadAction<{ filename: string }>) => {

            state.selectedPattern.params.textFieldParams
                = state.selectedPattern.params.textFieldParams
                .filter(param => {
                    let isParamConnectedWithFile = false;
                    param.filename.forEach(fileName => {
                        if (fileName === action.payload.filename) {
                            isParamConnectedWithFile = true;
                            return;
                        }
                    })
                    return isParamConnectedWithFile;
                    //param.filename !== action.payload.filename
                })
        },

        //-------------------------------
        removeTextFieldParams: (state, action: PayloadAction<{ replace: string }>) => {
            state.selectedPattern.params.textFieldParams
                = state.selectedPattern.params.textFieldParams
                .filter(param => param.replace !== action.payload.replace)
        },

        addFilesAndParamsToSelectedPattern: (
            state,
            action: PayloadAction<{ file: LoadedPatternFileInfo, params: TextFieldParamData[], howMany: number }>
        ) => {

            state.selectedTabIndex = 0;

            let appStateUtils = new AppStateUtils();

            let parts = action.payload.file.defaultName.split(".");

            let fileNameWithNoExtension = parts[0];
            let extension = parts[1];

            let paramsConnectedWithMultipleFiles: TextFieldParamData[] =
                [...action.payload.params.filter(param => param.filename.length > 1)]


            for (let i = 0; i < action.payload.howMany; i++) {

                let newFileName: string = i === 0 ?
                    fileNameWithNoExtension + "." + extension :
                    fileNameWithNoExtension + "(" + i + ")." + extension;

                let modifableParams = [...action.payload.params.filter(param => param.filename.length <= 1)];

                paramsConnectedWithMultipleFiles = paramsConnectedWithMultipleFiles.map(connectedParam => {
                    let tmpParam = {...connectedParam};

                    if (!tmpParam.filename.includes(newFileName)) {
                        tmpParam.filename = [...tmpParam.filename, newFileName]
                    }
                    return tmpParam;
                })

                let paramsConnectedWithFile = [...modifableParams.map(param => {
                    let newPattern: TextFieldParamData = {
                        ...param,
                        filename: [newFileName]
                    }
                    return newPattern;
                })];

                paramsConnectedWithFile.forEach(param => {
                    state.selectedPattern.params.textFieldParams.push(param);
                })


                state.selectedPattern.files.push({
                    sourceFile: action.payload.file.sourceFile,
                    defaultName: newFileName,
                    extension: action.payload.file.extension,
                    currentName: newFileName,
                    defaultContent: action.payload.file.defaultContent,
                    currentContent: action.payload.file.currentContent,
                })
            }
            paramsConnectedWithMultipleFiles = [...paramsConnectedWithMultipleFiles.map(connectedParam => {
                return appStateUtils.removeDeletedFilesReferenceFromConnectedParam(
                    state.selectedPattern.files,
                    connectedParam
                );
            })]

            paramsConnectedWithMultipleFiles.forEach(connectedParam => {

                state.selectedPattern.params.textFieldParams.push(connectedParam);
            })

        },

        updatePatternTextFieldParamValue: (state, action: PayloadAction<{ value: string, index: number }>) => {
            state.selectedPattern.params.textFieldParams[action.payload.index].currentValue = action.payload.value;
        },

        updatePatternFile: (state, action: PayloadAction<{ newContent: string, fileIndex: number }>) => {
            state.selectedPattern.files[action.payload.fileIndex].currentContent = action.payload.newContent;
        },

        updatePatternFilesContent: (state, action: PayloadAction<{ newContent: string[] }>) => {
            state.selectedPattern.files.map((file, index) => {
                file.currentContent = action.payload.newContent[index];
            })
        },

        setState: (state, action: PayloadAction<AppState>) => {

            state.appConfig = action.payload.appConfig;
            state.methodGeneratorConfig = action.payload.methodGeneratorConfig;
            state.isDrawerOpen = action.payload.isDrawerOpen;
            state.isEditorReadOnly = action.payload.isEditorReadOnly;
            state.selectedPatternFamillyIndex = action.payload.selectedPatternFamillyIndex;
            state.selectedPatternIndex = action.payload.selectedPatternIndex;
            state.selectedTabIndex = action.payload.selectedTabIndex;
            state.selectedPattern = action.payload.selectedPattern;

        },

        setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isDrawerOpen = action.payload;
        },

        setSelectedPatternFamillyIndex: (state, action: PayloadAction<number>) => {
            state.selectedPatternFamillyIndex = action.payload;
        },

        setSelectedPatternIndex: (state, action: PayloadAction<number>) => {
            state.selectedPatternIndex = action.payload;
        },

        setSelectedTabIndex: (state, action: PayloadAction<number>) => {
            state.selectedTabIndex = action.payload;
        },

        setSelectedPattern: (state, action: PayloadAction<PatternConfigInfo>) => {
            state.selectedPattern = action.payload;
        },

        setSelectedPatternFiles: (state, action: PayloadAction<LoadedPatternFileInfo[]>) => {
            state.selectedPattern.files = action.payload;
        },


        setIsEditorReadOnly: (state, action: PayloadAction<boolean>) => {
            state.isEditorReadOnly = action.payload;
        },

        changeSelectedPatternCurrentFileName: (state, action: PayloadAction<
            {
                currentName: string,
                fileIndex: number
            }>
        ) => {
            state.selectedPattern.files[action.payload.fileIndex].currentName = action.payload.currentName;
        },


    }
})

export const {
    addFilesAndParamsToSelectedPattern,

    removeFileFromPattern,
    removeTextFieldParamsConnectedToFile,
    removeTextFieldParams,

    updatePatternTextFieldParamValue,
    updatePatternFile,
    updatePatternFilesContent,

    setState,
    setIsDrawerOpen,
    setSelectedPatternFamillyIndex,
    setSelectedPatternIndex,
    setSelectedTabIndex,
    setSelectedPattern,
    setSelectedPatternFiles,
    setIsEditorReadOnly,

    changeSelectedPatternCurrentFileName

} = appStateSlice.actions

export default appStateSlice.reducer