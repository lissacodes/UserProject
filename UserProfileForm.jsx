import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import * as userProfileService from "../../services/userProfileService";
import { userProfileSchema } from "../../schemas/userProfileSchema";
import { Form, Formik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core/styles";
import propTypes from "prop-types";
import FileUpload from "../files/FileUpload";
import swal from "sweetalert";

import debug from "sabio-debug";
import {
  Box,
  Card,
  Grid,
  TextField,
  Button,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@material-ui/core";

import { onGlobalError } from "../../services/serviceHelpers";

const _logger = debug.extend("UserProfileForm");

const useStyles = makeStyles(() => ({
  card: {
    width: 345,
    marginLeft: 100,
  },
  formColOne: {
    marginTop: 30,
    marginRight: 20,
  },
  formColTwo: {
    marginTop: 30,
  },
}));

function UserProfileForm(props) {
  const history = useHistory();
  let userId = null;
  if (props.currentUser.id) {
    userId = props.currentUser.id;
  } else if (props.currentUser.userId) {
    userId = props.currentUser.userId;
  }
  const userRoles = props.currentUser.roles;

  const [formData, setFormData] = useState({
    profileId: 0,
    givenName: "",
    surnames: "",
    avatarUrl: "",
    userId: 0,
    url: "",
    urlTypeId: 0,
    roles: userRoles,
  });

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setFormData({
      ...formData,
      userId: userId,
    });

    userProfileService
      .getByUserId(userId)
      .then(onGetProfileByUserIdSuccess)
      .catch(onGlobalError);
  }, []);

  let onGetProfileByUserIdSuccess = (res) => {
    let currentUser = res.item;
    _logger("Successfully got user info", currentUser);

    setFormData({
      profileId: currentUser.profileId,
      givenName: currentUser.givenName,
      surnames: currentUser.surnames,
      avatarUrl: currentUser.avatarUrl,
      userId: currentUser.userId,
      email: currentUser.email,
      url: currentUser.url,
      urlTypeId: currentUser.urlTypeId,
      roles: userRoles,
    });
  };

  let onFormSubmission = (values) => {
    _logger(values);

    if (values.profileId === 0) {
      userProfileService
        .create(values)
        .then(() => onCreateUserProfileSuccess(values))
        .catch(onGlobalError);
    } else {
      userProfileService
        .update(values)
        .then(() => onUpdateProfileSuccess(values))
        .catch(onGlobalError);
    }
    if (toggle) onSetToggle();
  };

  let onCreateUserProfileSuccess = (res) => {
    _logger(res);
    swal("Profile Updated!", {
      icon: "success",
      timer: 2500,
    });
    if (
      props.currentUser.roles[0] === "Campaign" ||
      props.currentUser.roles[0] === "Surveyor"
    ) {
      setTimeout(() => {
        history.push(
          { pathname: `/dashboard/user` },
          {
            currentUser: res,
            type: "Update",
          }
        );
      }, 2000);
    } else {
      setTimeout(() => {
        history.push(
          { pathname: `/dashboard/${props.currentUser.roles[0]}` },
          {
            currentUser: res,
            type: "Update",
          }
        );
      }, 2000);
    }
  };

  let onUpdateProfileSuccess = (res) => {
    _logger(res);
    swal("Profile Updated!", {
      icon: "success",
      timer: 2500,
    });
    if (
      props.currentUser.roles[0] === "Campaign" ||
      props.currentUser.roles[0] === "Surveyor"
    ) {
      setTimeout(() => {
        history.push(
          { pathname: `/dashboard/user` },
          {
            currentUser: res,
            type: "Update",
          }
        );
      }, 2000);
    } else {
      setTimeout(() => {
        history.push(
          { pathname: `/dashboard/${props.currentUser.roles[0]}` },
          {
            currentUser: res,
            type: "Update",
          }
        );
      }, 2000);
    }
  };

  const classes = useStyles();

  const getUpload = (upload) => {
    setFormData({
      ...formData,
      avatarUrl: upload[0].url,
    });
  };

  const onSetToggle = () => {
    setToggle(!toggle);
  };

  const toggleUpload = () => {
    if (toggle === true) {
      return (
        <React.Fragment>
          <FileUpload onUpload={getUpload} isMultiple={false} />
          <Button
            variant="contained"
            color="secondary"
            onClick={onSetToggle}
            className="my-2"
          >
            Close Upload
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <Button variant="contained" color="secondary" onClick={onSetToggle}>
          Upload Picture
        </Button>
      );
    }
  };

  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        validationSchema={userProfileSchema}
        onSubmit={onFormSubmission}
      >
        {({ values, handleChange, errors, touched }) => (
          <Grid item xs={12} lg={7}>
            <Card>
              <Form className="px-3">
                <Grid container spacing={0}>
                  <Grid item xs={12} lg={6}>
                    <Box className={classes.formColOne}>{toggleUpload()}</Box>
                    <Box className={classes.formColOne}>
                      <TextField
                        name="givenName"
                        label="Given Name"
                        value={values.givenName}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={touched.givenName && Boolean(errors.givenName)}
                        helperText={touched.givenName && errors.givenName}
                      />
                    </Box>
                    <Box className={classes.formColOne}>
                      <TextField
                        name="surnames"
                        label="Surnames"
                        value={values.surnames}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={touched.surnames && Boolean(errors.surnames)}
                        helperText={touched.surnames && errors.surnames}
                      />
                    </Box>
                    <Box className={classes.formColOne}>
                      <TextField
                        name="socialmedia"
                        label="Social Media URL"
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        error={
                          touched.externalLinkUrl &&
                          Boolean(errors.externalLinkUrl)
                        }
                        helperText={
                          touched.externalLinkUrl && errors.externalLinkUrl
                        }
                      ></TextField>
                    </Box>
                    <Box m={5}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className="mb-5 mr-2"
                      >
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <div className={classes.formColTwo}>
                      <Card className={classes.card}>
                        <div className="editIconContainer mr-1 rounded-circle"></div>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            src={values.avatarUrl}
                          ></CardMedia>
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {values.givenName} {values.surnames}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {values.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {values.socialmedia}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </div>
                  </Grid>
                </Grid>
              </Form>
            </Card>
          </Grid>
        )}
      </Formik>
    </React.Fragment>
  );
}

UserProfileForm.propTypes = {
  currentUser: propTypes.shape({
    userId: propTypes.number,
    id: propTypes.number,
    email: propTypes.string,
    name: propTypes.string,
    roles: propTypes.arrayOf(propTypes.string),
    externalLinks: propTypes.arrayOf(propTypes.string),
  }),
};

export default UserProfileForm;
