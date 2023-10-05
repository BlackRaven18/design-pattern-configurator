import { Editor } from "@monaco-editor/react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Collapse, Grid, List, ListItemButton, ListItemText, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Config, LoadedPatternFileInfo, PatternFamillyInfo, PatternInfo } from "../types";
import CustomBackdrop from "./CustomBackdrop";
import DownloadButton from "./DownloadButton";


import { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor';
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedFile,
  setSelectedPattern,
  setSelectedPatternFamillyIndex,
  setSelectedPatternIndex,
  setSelectedTabIndex
} from "../redux/AppStateSlice";
import { RootState } from "../redux/store";


const Main = () => {

  const dispatch = useDispatch();

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const appConfig = useSelector((state: RootState) => state.appState.appConfig);

  const selectedPatternFamillyIndex = useSelector((state: RootState) => state.appState.selectedPatternFamillyIndex);
  const selectedPatternIndex = useSelector((state: RootState) => state.appState.selectedPatternIndex);
  const selectedTabIndex = useSelector((state: RootState) => state.appState.selectedTabIndex);

  const [isLoading, setIsLoading] = useState(false);

  const selectedPattern = useSelector((state: RootState) => state.appState.selectedPattern);
  const selectedFile = useSelector((state: RootState) => state.appState.selectedFile);

  const [editorValueArray, setEditorValueArray] = useState<string[]>([]);


  useEffect(() => {

    //let loadedPatternFile: LoadedPatternFileInfo = JSON.parse(JSON.stringify(selectedFile));

    handleFileRead(selectedPattern.patternFilesDirectory + "/" + selectedFile.name)
      .then(fileContent => {
        let loadedPatternFile: LoadedPatternFileInfo = {
          name: selectedFile.name,
          loaded: selectedFile.loaded,
          content: fileContent
        }

        dispatch(setSelectedFile(loadedPatternFile));
      })


    setEditorValueArray(new Array<string>(selectedPattern.files.length))

  }, [])



  useEffect(() => {
    loadEditorValueArray();

  }, [selectedPattern])

  const loadEditorValueArray = () => {
    let tmpArray = new Array<string>(selectedPattern.files.length);
    selectedPattern.files.map((file, index) => {
      handleFileRead(selectedPattern.patternFilesDirectory + "/" + file.name)
        .then(fileContent => {
          tmpArray[index] = fileContent;
        })
    })

    setEditorValueArray(tmpArray);
  }

  const handlePatterFamillyChange = (patternFamilly: PatternFamillyInfo, index: number) => {

    dispatch(setSelectedPatternFamillyIndex(index));
    handlePatternChange(patternFamilly.patterns[0], 0);
  }

  const handlePatternChange = (pattern: PatternInfo, index: number) => {

    //setIsLoading(true);

    dispatch(setSelectedPattern(pattern));
    dispatch(setSelectedPatternIndex(index));

    handleFileRead(pattern.patternFilesDirectory + "/" + pattern.files[0].name)
      .then(fileContent => {
        let newLoadedFile: LoadedPatternFileInfo = {
          name: pattern.files[0].name,
          loaded: pattern.files[0].loaded,
          content: fileContent,
        }

        dispatch(setSelectedFile(newLoadedFile));
        dispatch(setSelectedTabIndex(0));
      })


    setEditorValueArray(new Array<string>(pattern.files.length))

    //setIsLoading(false);



  }

  const handleTabChange = (index: number) => {


    handleFileRead(selectedPattern.patternFilesDirectory + "/" + selectedPattern.files[index].name)
      .then(fileContent => {
        let newLoadedFile: LoadedPatternFileInfo = {
          name: selectedPattern.files[index].name,
          loaded: selectedPattern.files[index].loaded,
          content: fileContent,
        }

        dispatch(setSelectedFile(newLoadedFile));
        dispatch(setSelectedTabIndex(index));
      })

  }


  const handleFileRead = async (filename: string) => {

    let content = "";
    try {
      const response = await fetch(filename);
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


  const handleEditorChange = (value: string) => {

    editorValueArray[selectedTabIndex] = value;

  }

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
  }

  const getEditorValue = () => {
    alert(editorRef?.current?.getValue() ?? "nothing")
  }

  const handleParamsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let tmp: string = selectedFile.content.replace("$CLASSNAME$", event.target.value);
    editorRef?.current?.setValue(tmp);



  }

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

      <Grid
        container
        direction="row"
      >
        <Grid
          item
          xs={2}
          sx={{
            minWidth: 150
          }}
        >
          <List component="nav">

            {appConfig.patternFamillies.map((patternFamilly, index) => {
              return (
                <Box key={index}>
                  <ListItemButton
                    sx={{
                      backgroundColor: "#2ECC71",
                      '&.Mui-selected': {
                        backgroundColor: '#58D68D',
                      },
                    }}
                    key={index}
                    selected={selectedPatternFamillyIndex === index}
                    onClick={() => handlePatterFamillyChange(patternFamilly, index)}
                  >
                    <ListItemText primary={patternFamilly.patternFamillyName} />
                    {selectedPatternFamillyIndex === index ? <ExpandLess /> : <ExpandMore />}

                  </ListItemButton>


                  <Collapse in={selectedPatternFamillyIndex === index} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {patternFamilly.patterns.map((pattern, index) => {
                        return (
                          <ListItemButton
                            key={index}
                            sx={{
                              pl: 4,
                              '&.Mui-selected': {
                                backgroundColor: '#82E0AA ',
                              },
                            }}
                            selected={selectedPatternIndex === index}
                            onClick={() => handlePatternChange(pattern, index)}
                          >
                            <ListItemText primary={pattern.patternName} />
                          </ListItemButton>
                        );
                      })}

                    </List>
                  </Collapse>

                </Box>

              );
            })}

          </List>
          <DownloadButton editorValueArray={editorValueArray} selectedPattern={selectedPattern} />
          <Button onClick={() => getEditorValue()}>Show editor content</Button>

        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            backgroundColor: "#F4D03F"
          }}
        >
          <Stack>
            <TextField
              id="class-name"
              label="Singleton class name"
              variant="outlined"
              onChange={(event) => handleParamsChange(event)}
            // => {handleParamsChange(value)}}
            />
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{
            // bgcolor: '#2e1534',
            bgcolor: "#ffffff"
          }}>

            <List component={Stack} direction="row">
              {selectedPattern.files.map((file, index) => {
                return (
                  <ListItemButton
                    key={index}
                    selected={selectedTabIndex === index}
                    onClick={() => handleTabChange(index)}
                  >

                    <ListItemText primary={file.name} />
                  </ListItemButton>
                );
              })}

            </List>

          </Box>
          <Editor
            height="90vh"
            theme="vs-dark"
            path={selectedFile.name}
            defaultLanguage={"java"}
            defaultValue={selectedFile.content}
            onChange={(value) => handleEditorChange(value ?? "")}
            onMount={handleEditorDidMount}
          />




        </Grid>
      </Grid>
    </Box>
  )
}



export default Main;