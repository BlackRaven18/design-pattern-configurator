import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addFilesAndParamsToSelectedPattern,
    removeFileFromPattern,
    removeTextFieldParams,
    updateSelectParamCurrentValue
} from "../../redux/AppStateSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { LoadedPatternFileInfo, TextFieldParamData } from "../../types";
import { setIsChangesMade } from "../../redux/UnsavedProgressSlice";

interface SelectParamProps {
    index: number,
    label: string,
    fileNameToBeMultiplied: string,
    minValue: number,
    maxValue: number,
    currentValue: number,
    disabled: boolean,
}

const getArrayWithNumbersBetweenMinAndMax = (min: number, max: number): number[] => {
    let array = [];

    for (let i = min; i <= max; i++) {
        array.push(i);
    }
    return array;
}


export default function SelectParam(props: SelectParamProps) {

    const dispatch = useDispatch<AppDispatch>();

    const [value, setValue] = useState<string>(props.currentValue?.toString());
    const rangeArray: number[] = getArrayWithNumbersBetweenMinAndMax(props.minValue, props.maxValue);

    const selectedPattern = useSelector((state: RootState) => state.appState.selectedPattern);


    const handleChange = (event: SelectChangeEvent) => {
        dispatch(setIsChangesMade(true));
        dispatch(updateSelectParamCurrentValue({
            value: parseInt(event.target.value),
            index: props.index
        }
        ))
        setValue(event.target.value);

        let file = selectedPattern.files.filter(file => file.sourceFile === props.fileNameToBeMultiplied)[0];

        setClasses(file, parseInt(event.target.value));
    };

    const setClasses = (file: LoadedPatternFileInfo, numberOfInstances: number) => {

        let paramsConnectedToFile: TextFieldParamData[] = [];

        //get the params connected to filename
        selectedPattern.params.textFieldParams.forEach(param => {
            if (param.filename.includes(file.defaultName)) {
                paramsConnectedToFile.push(param);
            }
        })

        //clear all class like filename and params connected to it
        dispatch(removeFileFromPattern({ filename: file.defaultName }));

        paramsConnectedToFile.forEach(param => {
            dispatch(removeTextFieldParams({ replace: param.replace }))
        })

        //add new filenames
        //add new params connected to filename (we need to know what params were connected)
        dispatch(addFilesAndParamsToSelectedPattern({
            file: file,
            params: paramsConnectedToFile,
            howMany: numberOfInstances
        }
        ))
    }


    return (
        <FormControl
            fullWidth
            disabled={props.disabled}
        >
            <InputLabel>{props.label}</InputLabel>
            <Select
                data-testid={'select-param-test-id'}
                value={value}
                label={props.label}
                onChange={handleChange}
            >
                {rangeArray.map((value, index) => {
                    return (
                        <MenuItem key={index} value={value}>{value}</MenuItem>
                    );
                })}

            </Select>
        </FormControl>
    );
}