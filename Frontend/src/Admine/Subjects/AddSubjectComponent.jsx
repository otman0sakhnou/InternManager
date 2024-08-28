import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
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
  Backdrop,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import FroalaEditor from 'react-froala-wysiwyg';
import useSubjectStore from 'store/useSubjectStore';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/languages/de.js'
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/third_party/image_tui.min.js';
import 'froala-editor/js/third_party/embedly.min.js';
import 'froala-editor/js/third_party/spell_checker.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/file.min.js';
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
import { DNA } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import axios from 'axios';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';

const AddSubjectComponent = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const { addSubject } = useSubjectStore();
  const { id } = useParams();
  const GroupId = uuidValidate(id) && id;;
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [stepInput, setStepInput] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleAddStep = () => {
    if (stepInput.trim() !== '') {
      const newStep = {
        description: stepInput,
        order: steps.length + 1,  // Ensure correct order when adding new steps
      };
      setSteps([...steps, newStep]);
      setStepInput('');
    }
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      order: i + 1,  // Reorder steps after removal
    }));
    setSteps(newSteps);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newSteps = [...steps];
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);

    // Update the order based on new positions
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    setSteps(reorderedSteps);
  };

  const handleMediaInsert = (mediaType, $media) => {
    let blobUrl;
    if (mediaType === 'video') {
      const $video = $media.find('video');
      blobUrl = $video.attr('src');

    } else {
      blobUrl = $media.attr('src') || $media.attr('href');
    }
    console.log(`Inserted : ${mediaType} :${blobUrl}`)

  };

  const extractMediaUrls = (html) => {
    const imgRegex = /<img\s+[^>]*src="(blob:[^"]*)"[^>]*>/g;
    const videoRegex = /<video\s+[^>]*src="(blob:[^"]*)"[^>]*>/g;
    const fileRegex = /<a\s+[^>]*href="(blob:[^"]*)"[^>]*>/g;

    const mediaUrls = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      console.log(`Extracted image URL: ${match[1]}`);
      mediaUrls.push({ url: match[1], type: 'image' });
    }
    while ((match = videoRegex.exec(html)) !== null) {
      console.log(`Extracted video URL: ${match[1]}`);
      mediaUrls.push({ url: match[1], type: 'video' });
    }
    while ((match = fileRegex.exec(html)) !== null) {
      console.log(`Extracted file URL: ${match[1]}`);
      mediaUrls.push({ url: match[1], type: 'file' });
    }

    return mediaUrls;
  };

  const uploadMedia = async (blobUrl, mediaType) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    console.log("blob : ", blob);
    const extension = blob.type.split("/")[1];
    const formData = new FormData();
    const filename = `${mediaType}-${Date.now()}.${extension}`;

    formData.append('file', blob, filename);
    console.log("Form Data :", formData);
    console.log("media type :", mediaType);
    console.log("file name :", filename);

    try {
      const res = await axios.post(`${API_BASE_URL}/upload/${mediaType}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data'
        }
      });

      if (res.status === 200) {
        console.log("link :", res.data.link);
        return res.data.link;
      } else {
        console.log(res);
        throw new Error(res.data.message || "Upload failed");
      }
    } catch (error) {
      console.error(`Error uploading ${mediaType}:`, error.message);
      return null;
    }
  };


  const handleUploadMedia = async () => {
    const mediaUrls = extractMediaUrls(description);
    const uploadPromises = mediaUrls.map((media) =>
      uploadMedia(media.url, media.type)
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    let updatedDescription = description;
    mediaUrls.forEach((media, index) => {
      const uploadedUrl = uploadedUrls[index];
      if (uploadedUrl) {
        updatedDescription = updatedDescription.replace(media.url, uploadedUrl);
      }
    });

    return updatedDescription;
  };
  const handleSubmit = async () => {
    setLoading(true);
    const updateDescription = await handleUploadMedia();
    const newSubject = {
      GroupId,
      title,
      type,
      description: updateDescription,
      steps,
    };
    try {
      await addSubject(newSubject);
      toast.success("Subject added successfully")
      console.log("new subject :", newSubject);
      navigate(`/groupdetails/${newSubject.GroupId}`);
    } catch (error) {
      toast.error("Error adding subject :", error.message);
      console.log("error adding subject :", error.message);
    } finally {
      setLoading(false);
      setTitle('');
      setType('');
      setDescription('');
      setSteps([]);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2, md: 5 } }}>
        <SoftBox p={3} textAlign="center">
          <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
            Add New Subject
          </SoftTypography>
        </SoftBox>
        <Paper elevation={5} sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 3, mx: { xs: 1, sm: 2, md: 5 }, borderRadius: 2 }}>
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
                    'media.inserted': handleMediaInsert,
                    'image.inserted': ($img) => handleMediaInsert('image', $img),
                    'image.error': function (error) {
                      console.error('Image upload error', error);
                    },
                    'video.inserted': ($video) => handleMediaInsert('video', $video),
                    'video.error': function (error) {
                      console.error('video upload error', error);
                    },
                    'file.inserted': ($file) => handleMediaInsert('file', $file),
                    fileMaxSize: 200 * 1024 * 1024,
                    fileAllowedTypes: ['*'],
                    'file.error': function (error) {
                      console.error('file upload error', error);
                    },
                    'blur': (e) => setDescription(e.target.innerHTML),
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StyledIcon>
                          <FastForwardRoundedIcon />
                        </StyledIcon>
                      </InputAdornment>
                    ),
                  }}
                />
                <SoftButton variant="gradient" color="info" onClick={handleAddStep}>
                  <Icon>add</Icon>
                </SoftButton>
              </Box>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="steps" direction="horizontal">
                  {(provided) => (
                    <Grid
                      container
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      justifyContent="center"
                      sx={{
                        overflowX: 'auto',
                        px: 1,
                      }}
                    >
                      {steps.map((step, index) => (
                        <Draggable key={index} draggableId={index.toString()} index={index}>
                          {(provided) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                background: 'linear-gradient(90deg, #4a6cff, #4ad0fd)',
                                borderRadius: 20,
                                px: 2,
                                py: 1,
                                mx: 1,
                                my: 0.5,
                                textTransform: "none",
                                width: "auto",
                                flexShrink: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                position: "relative",
                                minWidth: 150,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  position: 'absolute',
                                  top: -5,
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
                                  color: '#fff',
                                }}
                              >
                                {step.description}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveStep(index)}
                                sx={{
                                  color: '#fff',
                                }}
                              >
                                <Icon>close_rounded_icon</Icon>
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
              <SoftButton variant="gradient" color="primary" onClick={handleSubmit} textGradient>
                Save Subject
              </SoftButton>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Backdrop
        sx={{ color: "#ff4", backgroundImage: "linear-gradient(135deg, #ced4da  0%, #ebeff4 100%)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <DNA
          visible={true}
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </Backdrop>
    </DashboardLayout>
  );
};

export default AddSubjectComponent;
