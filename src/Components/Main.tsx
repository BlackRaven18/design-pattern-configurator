import { Box, Grid, Stack } from "@mui/material";
import { editor } from "monaco-editor";
import { useRef, useState } from "react";
import CustomBackdrop from "./common/CustomBackdrop";
import EditorPanel from "./EditorPanel";
import ParametersPanel from "./ParametersPanel";
import TopBar from "./TopBar";
import MyDrawer from "./MyDrawer";
import PatternsMenu from "./PatternsMenu";


const Main = () => {

  const [isLoading, setIsLoading] = useState(false);

  const parentEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const setEditorRef = (editorRef: editor.IStandaloneCodeEditor | null) => {
    parentEditorRef.current = editorRef;
  };

  return (
    <Box
      sx={{
        padding: "5px",
        backgroundColor: "#3FFF90",
        height: "100%",

      }}
    >
      {isLoading ? (
        <CustomBackdrop label={"Loading..."} />
      ) : (<></>)}

      <TopBar />

      <MyDrawer headerLabel="Design Patterns" width="250px">
        <PatternsMenu />
      </MyDrawer>

      <Grid
        container
        direction="row"
      >
    
        <Grid
          item
          xs={3}
          sx={{
            backgroundColor: "#F9E79F",
            paddingTop: "10px"
          }}
        >
          <Stack>
            <ParametersPanel editorRef={parentEditorRef} />
          </Stack>
        </Grid>
        <Grid item xs={9}>

          <EditorPanel setEditorParentRef={setEditorRef} />

        </Grid>
      </Grid>
    </Box>
  )
}



export default Main;