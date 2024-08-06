import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Paper,
  Icon,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import FroalaEditor from 'react-froala-wysiwyg';
import useSubjectStore from 'store/useSubjectStore';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/languages/de.js';
import 'froala-editor/js/third_party/image_tui.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/third_party/spell_checker.min.js';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/js/third_party/font_awesome.min.js';
import StyledIcon from 'components/StyledIcon';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';

const AddSubjectComponent = () => {
  const { addSubject } = useSubjectStore();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [stepInput, setStepInput] = useState('');

  const handleAddStep = () => {
    if (stepInput.trim() !== '') {
      setSteps([...steps, { description: stepInput }]);
      setStepInput('');
    }
  };
  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newSteps = [...steps];
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);

    setSteps(newSteps);
  };

  const handleSubmit = () => {
    const newSubject = {
      id: Date.now().toString(),
      groupeId:id,
      title,
      type,
      description,
      steps,
    };
    addSubject(newSubject);
    console.log("new subject :",newSubject);
    setTitle('');
    setType('');
    setDescription('');
    setSteps([]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 20 } }}>
        <SoftBox p={3} textAlign="center">
          <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
            Add New Subject
          </SoftTypography>
        </SoftBox>
        <Paper elevation={5} sx={{ px: { xs: 2, sm: 5, md: 10 }, py: 3, mx: { xs: 1, sm: 5, md: 10 }, borderRadius: 2 }}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <SoftTypography variant="h6" color="dark" textGradient gutterBottom>
                Title
              </SoftTypography>
              <TextField
                fullWidth
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StyledIcon>title_icon</StyledIcon>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SoftTypography variant="h6" color="dark" textGradient gutterBottom>
                Subject type
              </SoftTypography>
              <FormControl fullWidth>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <span style={{ color: '#CCCCCC' }}>Select Subject&apos;s type</span>;
                    }
                    return selected;
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <StyledIcon>assignment_icon</StyledIcon>
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    Select Subject&apos;s type
                  </MenuItem>
                  <MenuItem value="formation">Formation</MenuItem>
                  <MenuItem value="project">Project</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <SoftTypography variant="h5" color="dark" textGradient gutterBottom>
                Subject description
              </SoftTypography>
              <FroalaEditor
                tag="textarea"
                config={{
                  placeholderText: 'Start entering your description for this subject',
                  charCounterCount: true,
                  attribution: false,
                  events: {
                    'contentChanged': function () {
                      setDescription(this.html.get());
                    },
                  },
                }}
                model={description}
                onModelChange={(newDescription) => setDescription(newDescription)}
              />
            </Grid>
            <Grid item xs={12}>
              <SoftTypography variant="h5" color="dark" textGradient align="left">
                Steps to Follow
              </SoftTypography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Add a step"
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  sx={{ mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}
                />
                <SoftButton variant="gradient" color="info" onClick={handleAddStep}>
                  <Icon>add</Icon>
                </SoftButton>
              </Box>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="steps" direction="horizontal">
                  {(provided) => (
                    <Grid container {...provided.droppableProps} ref={provided.innerRef} justifyContent="center">
                      {steps.map((step, index) => (
                        <Draggable key={index} draggableId={index.toString()} index={index}>
                          {(provided) => (
                            <Grid
                              item
                              xs={12}
                              md={3}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 2,
                                mx: 2,
                                p: 2,
                                border: '1px solid #d1d9ff',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                borderRadius: 2,
                                backgroundColor: '#f0f4ff',
                                '&:hover': {
                                  backgroundColor: '#e1eaff',
                                },
                                display: 'flex',
                                alignItems: 'center',
                                textAlign: 'left',
                                boxShadow: 1,
                                position: 'relative',
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  position: 'absolute',
                                  top: -12,
                                  left: 10,
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  color: '#3f51b5',
                                  backgroundColor: '#fff',
                                  padding: '0 5px',
                                  borderRadius: 1,
                                  boxShadow: 1,
                                }}
                              >
                                Step {index + 1}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  flexGrow: 1,
                                  overflowWrap: 'break-word',
                                  ml: 3,
                                  color: '#333',
                                }}
                              >
                                {step.description}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveStep(index)}
                                sx={{
                                  color: '#ff5252',
                                  '&:hover': {
                                    color: '#ff1744',
                                  },
                                }}
                              >
                                <StyledIcon>close_rounded_icon</StyledIcon>
                              </IconButton>
                            </Grid>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Grid>
                  )}
                </Droppable>
              </DragDropContext>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <SoftButton variant="gradient" color="primary" onClick={handleSubmit}>
                Save Subject
              </SoftButton>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default AddSubjectComponent;
