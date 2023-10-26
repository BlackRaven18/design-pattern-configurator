import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Collapse, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
   setIsDrawerOpen,
   setSelectedPattern,
   setSelectedPatternFamillyIndex,
   setSelectedPatternIndex,
   setSelectedTabIndex,
} from "../redux/AppStateSlice";
import { AppDispatch, RootState } from "../redux/store";
import { LoadedPatternFileInfo, PatternFamillyInfo, PatternInfo } from "../types";
import FileReader from "../utils/FileReader";

const PatternsMenu = () => {

   const dispatch = useDispatch<AppDispatch>();

   const appConfig = useSelector((state: RootState) => state.appState.appConfig);
   const selectedPatternFamillyIndex = useSelector((state: RootState) => state.appState.selectedPatternFamillyIndex);
   const selectedPatternIndex = useSelector((state: RootState) => state.appState.selectedPatternIndex);
;

   const fileReader = new FileReader();

   const handlePatterFamillyChange = (patternFamilly: PatternFamillyInfo, index: number) => {

      dispatch(setSelectedPatternFamillyIndex(index));
      handlePatternChange(patternFamilly.patterns[0], 0);
   }

   const handlePatternChange = (pattern: PatternInfo, index: number) => {

      //setIsLoading(true);

      let sourceFiles = pattern.files.map(file => {
         return pattern.patternFilesDirectory + "/" + file.defaultName;
     })

     fileReader.readMultipleFiles(sourceFiles).then(filesContent => {
      
        let extendedPatternInfo = fileReader.getExtendedPatternInfo(pattern, filesContent)
   
   
        dispatch(setSelectedPattern(extendedPatternInfo));
        dispatch(setSelectedPatternIndex(index));
        dispatch(setSelectedTabIndex(0));
     })



      //fileReader.loadFileToState(pattern.patternFilesDirectory, pattern.files[0].defaultName)


   }

   return (
         <Box>
            <List component="nav">

               {appConfig.patternFamillies.map((patternFamilly, index) => {
                  return (
                     <Box key={index}>
                        <ListItemButton
                           sx={{
                              backgroundColor: "primary.dark",
                              '&.Mui-selected': {
                                 backgroundColor: 'primary.dark',
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
                                             backgroundColor: 'action.active',
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
            {/* <DownloadButton editorValueArray={editorValueArray} selectedPattern={selectedPattern} />
            <Button onClick={() => getEditorValue()}>Show editor content</Button> */}
         </Box>
   );
}


export default PatternsMenu;