import { FormControlLabel, Switch } from "@mui/material";


interface EditorReadOnlySwitchProps{
    isEditorReadOnly: boolean,
    handleEditorReadOnlyChange: () => void,
}

export default function EditorReadOnlySwitch(props: EditorReadOnlySwitchProps){
    return(
        <FormControlLabel
                control={
                    <Switch
                        checked={props.isEditorReadOnly}
                        onChange={props.handleEditorReadOnlyChange}
                    />
                }
                label="Read only mode"
            />
    );
}